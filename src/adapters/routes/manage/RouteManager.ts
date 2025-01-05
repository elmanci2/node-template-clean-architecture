import { Router, RequestHandler, Response, Request } from 'express';

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

type Route = {
    path: string;
    handler: (req: Request, res: Response) => void;
    middlewares?: RequestHandler[];
    name?: string;
    description?: string;
};

type IRoutes = Partial<Record<HTTPMethod, Route[]>>;

class RoutesManager {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    /**
     * Adds a set of routes to the router.
     * @param routesList Object containing routes grouped by HTTP method.
     * @returns Current instance to allow chaining.
     */
    public addRoutes(routesList: IRoutes): this {
        for (const [method, routes] of Object.entries(routesList)) {
            if (this.isValidMethod(method)) {
                (routes as Route[]).forEach(route => {
                    if (!route.path || !route.handler) {
                        console.error(`Invalid route configuration: ${JSON.stringify(route)}`);
                        return;
                    }
                    const middlewares = route.middlewares || [];
                    this.router[method as HTTPMethod](route.path, ...middlewares, route.handler);
                });
            } else {
                console.warn(`Invalid HTTP method: ${method}`);
            }
        }
        return this;
    }

    /**
     * Adds global middlewares to the router.
     * @param middlewares Array of middlewares to add.
     * @returns 
     */

    public addGlobalMiddlewares(middlewares: RequestHandler[]): this {
        this.router.use(...middlewares);
        return this;
    }

    /**
     * Returns the configured router.
     * @returns Instance of Express Router.
     */
    public getRouter(): Router {
        return this.router;
    }

    /**
     * Validates if the HTTP method is valid.
     * @param method HTTP method to validate.
     * @returns Boolean indicating if the method is valid.
     */
    private isValidMethod(method: string): method is HTTPMethod {
        const validMethods: HTTPMethod[] = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
        return validMethods.includes(method as HTTPMethod);
    }
}

export { RoutesManager };