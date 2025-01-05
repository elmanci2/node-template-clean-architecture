
import routesManager from '@/adapters/routes';
import { dbConnection } from '@/infrastructure/database';
import logger from '@/infrastructure/package/logger';
import ExpressServer from '@/infrastructure/server/express/expressServer';
import cors from 'cors';

class main {
    private db: typeof dbConnection;
    private server: typeof ExpressServer;
    constructor(db: typeof dbConnection, server: typeof ExpressServer) {
        this.db = db;
        this.server = server;
    }

    public async start() {
        try {
            await this.db.connect({ alter: true });
            this.server.use(cors())
                .use(logger.middleware)
                .use(routesManager.getRouter())
                .start({ port: 3000 });
        } catch (error) {
            console.error(error);
        }
    }
}

new main(dbConnection, ExpressServer).start(); 