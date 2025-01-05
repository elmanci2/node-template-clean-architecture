import express from 'express';

interface IConfig {
    port: number;
}

export class ExpressServer {

    constructor(private app: express.Application) {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public use(middleware: express.RequestHandler): this {
        this.app.use(middleware);
        return this;
    }

    public async start(config: IConfig) {
        try {
            this.app.listen(config.port, () => {
                console.log(`Server started at http://localhost:${config.port}`);
            });
        } catch (error) {
            console.error('Error starting server:', error);
        }
    }
}

const app = express();

const Server = new ExpressServer(app);

export default Server as ExpressServer;
