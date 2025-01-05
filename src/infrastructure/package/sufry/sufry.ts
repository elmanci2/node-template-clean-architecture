/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;
type Factory<T> = Constructor<T> | ((...args: any[]) => T);

type Container<T extends Record<string, any>> = {
    [K in keyof T]: {
        args?: any[];
        inject?: string[];
        factory: Factory<T[K]>;
        scope?: 'singleton' | 'transient';
        group?: string;
        interceptor?: (instance: any) => any;
        lazy?: boolean;
    };
};

class Sufry<T extends Record<string, any>> {
    private container: Container<T>;
    private instances: Map<string, any>;
    private eventListeners: Map<string, Function[]>;

    constructor(dependencies: Container<T>) {
        this.container = dependencies;
        this.instances = new Map();
        this.eventListeners = new Map();
        this.initialize();
    }

    private initialize() {
        Object.keys(this.container).forEach((key) => {
            const dependency = this.container[key as keyof T]; 
            const { args = [], inject, factory, scope = 'transient', interceptor, lazy = false } = dependency;

            let resolvedDependencies: any[] = [];

            if (inject && Array.isArray(inject)) {
                resolvedDependencies = inject.map(depKey => this.resolve(depKey as keyof T)); 
            }

            this.container[key as keyof T] = {
                ...dependency,
                factory: (...additionalArgs: any[]) => {
                    if (scope === 'singleton' && !lazy) {
                        if (this.instances.has(key)) {
                            return this.instances.get(key);
                        } else {
                            const instance = this.createInstance(factory, ...resolvedDependencies, ...args, ...additionalArgs);
                            this.instances.set(key, instance);
                            return instance;
                        }
                    } else if (lazy) {
                        return (...argsLazy: any[]) => {
                            if (!this.instances.has(key)) {
                                const instance = this.createInstance(factory, ...resolvedDependencies, ...args, ...argsLazy);
                                this.instances.set(key, instance);
                            }
                            return this.instances.get(key);
                        };
                    } else {
                        return this.createInstance(factory, ...resolvedDependencies, ...args, ...additionalArgs);
                    }
                },
            };

            if (interceptor) {
                const originalFactory = this.container[key as keyof T].factory;
                this.container[key as keyof T].factory = (...args: any[]) => {
                    const instance = this.createInstance(originalFactory, ...args);
                    return interceptor(instance);
                };
            }
        });
    }

    private createInstance<T>(factory: Factory<T>, ...args: any[]): T {
        if (this.isConstructor(factory)) {
            return new factory(...args);
        }
        return factory(...args);
    }

    private isConstructor<T>(factory: Factory<T>): factory is Constructor<T> {
        return (factory as Constructor<T>).prototype?.constructor !== undefined;
    }

    resolve<K extends keyof T>(key: K): T[K] {
        const dependency = this.container[key];
        if (!dependency) {
            throw new Error(`Dependency '${String(key)}' not found.`);
        }

        const args = dependency.args || [];
        const instance = this.createInstance(dependency.factory, ...args);

        this.emitEvent('resolved', String(key), instance);

        return instance;
    }

    register<K extends keyof T>(key: K, value: { args?: any[]; inject?: string[]; factory: Factory<T[K]>; scope?: 'singleton' | 'transient'; group?: string; interceptor?: (instance: any) => any; lazy?: boolean }): void {
        if (this.container[key]) {
            throw new Error(`Dependency '${String(key)}' is already registered.`);
        }
        this.container[key] = value;
        this.emitEvent('registered', String(key), value); 
    }

    resolveGroup(group: string): any[] {
        const groupDeps = Object.entries(this.container)
            .filter(([_, value]) => value.group === group)
            .map(([key]) => this.resolve(key as keyof T));

        return groupDeps;
    }

    private emitEvent(event: string, key: string, data: any) {
        const listeners = this.eventListeners.get(event) || [];
        listeners.forEach(listener => listener(key, data));
    }

    on(event: string, listener: Function) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(listener);
    }

    private cacheInstance<T>(key: string, instance: T): void {
        if (!this.instances.has(key)) {
            this.instances.set(key, instance);
        }
    }
}

export default Sufry;
