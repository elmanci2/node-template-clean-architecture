
import authRoutes from "./list/auth/auth";
import { RoutesManager } from "./manage/RouteManager";

const routesManager = new RoutesManager();



routesManager.globalMiddlewares({
    keys: ["Usuarios", "Vehículos", "Chat_AI", "Uploads"],
    middlewares: [],
})

routesManager.addRoutes({
    name: "Auth",
    description: "Rutas de autenticación (login, registro)",
    prefix: "/auth",
    routes: authRoutes,
});

export default routesManager;
