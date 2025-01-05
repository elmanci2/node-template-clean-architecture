import { DbConnection } from './connection/Connection';
import { TvShow, Season, Episode, setupAssociations } from './models/models';
import { dbController } from './controller/index';

const databasePath = `src/infrastructure/database/db.sqlite`;

const dbConnection = new DbConnection({ dialect: 'sqlite', storage: databasePath, logging: false });

const db = dbConnection.getDb();

TvShow.initialize(db);
Season.initialize(db);
Episode.initialize(db);

setupAssociations();


const models = {
    TvShow,
    Season,
    Episode,
};

const dataBaseWrapper = new dbController(db, models)

export { dbConnection, db, models, dataBaseWrapper };