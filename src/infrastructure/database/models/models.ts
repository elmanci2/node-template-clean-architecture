import { Model, DataTypes, Sequelize } from 'sequelize';

class TvShow extends Model {
    declare id: number;
    declare name: string;

    static initialize(sequelize: Sequelize) {
        TvShow.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            { sequelize, modelName: 'TvShow' }
        );
    }
}

class Season extends Model {
    declare id: number;
    declare name: string;

    static initialize(sequelize: Sequelize) {
        Season.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            { sequelize, modelName: 'Season' }
        );
    }
}

class Episode extends Model {
    declare id: number;
    declare name: string;

    static initialize(sequelize: Sequelize) {
        Episode.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            { sequelize, modelName: 'Episode' }
        );
    }
}

function setupAssociations() {
    TvShow.hasMany(Season, { foreignKey: 'tvShowId', as: 'seasons' });
    Season.belongsTo(TvShow, { foreignKey: 'tvShowId', as: 'tvShow' });

    Season.hasMany(Episode, { foreignKey: 'seasonId', as: 'episodes' });
    Episode.belongsTo(Season, { foreignKey: 'seasonId', as: 'season' });
}

export { TvShow, Season, Episode, setupAssociations };
