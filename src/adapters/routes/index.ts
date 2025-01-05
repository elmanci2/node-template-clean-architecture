import authRoutes from './list/auth/auth';
import { RoutesManager } from './manage/RouteManager';

const routesManager = new RoutesManager();

routesManager.addRoutes(authRoutes)
    .addGlobalMiddlewares([]);

export default routesManager as RoutesManager;