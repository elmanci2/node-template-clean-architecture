/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, RequestHandler, Response, Request } from "express";

type HTTPMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

type Route = {
  path: string;
  handler: (req: Request, res: Response) => void;
  middlewares?: RequestHandler[] | any;
  name?: string;
  description?: string;
};

type IRoutes = Partial<Record<HTTPMethod, Route[]>>;

type RouteGroup = {
  name?: string;
  description?: string;
  prefix?: string;
  middlewares?: RequestHandler[] | any;
  routes: IRoutes;
};

type NamedGlobalMiddleware = {
  keys: string[]; 
  middlewares: RequestHandler[] | any;
};

class RoutesManager {
  private rootRouter: Router;
  private globalMiddlewareRegistry: NamedGlobalMiddleware[] = [];

  constructor() {
    this.rootRouter = Router();
  }

  /**
   * Registra middlewares globales basados en el nombre del grupo.
   * Estos se aplican automáticamente en `addRoutes` si el nombre coincide.
   */
  public globalMiddlewares(config: NamedGlobalMiddleware): this {
    this.globalMiddlewareRegistry.push(config);
    return this;
  }

  /**
   * Agrega un grupo de rutas al router, aplicando middlewares específicos
   * y globales si coinciden por nombre.
   */
  public addRoutes(group: RouteGroup): this {
    const {
      prefix = "/",
      middlewares = [],
      routes,
      name,
      description,
    } = group;

    const isolatedRouter = Router();

    for (const [method, routeList] of Object.entries(routes)) {
      if (!this.isValidMethod(method)) {
        console.warn(`⚠️ Método HTTP inválido: ${method}`);
        continue;
      }

      (routeList as Route[]).forEach((route) => {
        if (!route.path || !route.handler) {
          console.error(`❌ Ruta inválida: ${JSON.stringify(route)}`);
          return;
        }

        const routeMiddlewares = route.middlewares || [];
        isolatedRouter[method as HTTPMethod](
          route.path,
          ...routeMiddlewares,
          route.handler
        );
      });
    }

    // Buscar middlewares globales que coincidan por nombre
    const matchingGlobalMiddlewares = this.globalMiddlewareRegistry
      .filter((entry) => name && entry.keys.includes(name))
      .flatMap((entry) => entry.middlewares);

    // Unificar middlewares
    const allMiddlewares = [...matchingGlobalMiddlewares, ...middlewares];

    // Montar el router aislado
    this.rootRouter.use(prefix, ...allMiddlewares, isolatedRouter);

    // Log opcional
    if (name || description) {
      console.log(`✅ [${name || "Grupo de rutas"}] montado en '${prefix}'`);
      if (description) console.log(`   ↪︎ ${description}`);
    }

    return this;
  }

  /**
   * Retorna el router compuesto final.
   */
  public getRouter(): Router {
    return this.rootRouter;
  }

  /**
   * Verifica si el método HTTP es válido.
   */
  private isValidMethod(method: string): method is HTTPMethod {
    const validMethods: HTTPMethod[] = [
      "get",
      "post",
      "put",
      "delete",
      "patch",
      "options",
      "head",
    ];
    return validMethods.includes(method as HTTPMethod);
  }
}

export { RoutesManager, RouteGroup, IRoutes, Route };
