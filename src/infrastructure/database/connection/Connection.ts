import { Sequelize, SyncOptions, Options } from 'sequelize';


interface Connection {
    connect(options: SyncOptions): Promise<boolean>;
}

class DbConnection implements Connection {
    private connectionOptions: Options;
    private db: Sequelize;

    constructor(connectionOptions: Options) {
        this.connectionOptions = connectionOptions ?? { dialect: 'sqlite', storage: './db.sqlite' };
        this.db = new Sequelize(this.connectionOptions);
    }

    public async connect(options: SyncOptions): Promise<boolean> {
        try {
            await this.db.sync(options);
            await this.db.authenticate();
            console.log('Database connection established successfully.');
            return true;
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            return false;
        }
    }

    public getDb(): Sequelize {
        return this.db;
    }
}

export { DbConnection };
