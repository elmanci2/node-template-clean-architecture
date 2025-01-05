/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize, Model, ModelStatic, FindOptions, DestroyOptions, UpdateOptions } from 'sequelize';

class dbController {
    private db: Sequelize;
    private models: { [key: string]: ModelStatic<Model<any, any>> };

    constructor(db: Sequelize, models: { [key: string]: ModelStatic<Model<any, any>> }) {
        this.db = db;
        this.models = models;
    }

    public async create(modelName: string, data: object): Promise<Model> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        //@ts-ignore
        return await model.create(data);
    }

    public async bulkCreate(modelName: string, data: object[]): Promise<Model[]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        //@ts-ignore
        return await model.bulkCreate(data);
    }

    public async findAll(modelName: string, options?: FindOptions): Promise<Model[]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        return await model.findAll(options);
    }

    public async findOne(modelName: string, options?: FindOptions): Promise<Model | null> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        return await model.findOne(options);
    }

    public async findById(modelName: string, id: number | string): Promise<Model | null> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        return await model.findByPk(id);
    }

    public async update(modelName: string, id: number | string, data: object): Promise<Model> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        const instance = await model.findByPk(id);
        if (!instance) throw new Error(`Instancia con id ${id} no encontrada`);
        return await instance.update(data);
    }

    public async bulkUpdate(modelName: string, data: object, options?: UpdateOptions): Promise<[number, Model[]]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        //@ts-ignore
        return await model.update(data, options);
    }

    public async delete(modelName: string, id: number | string): Promise<void> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        const instance = await model.findByPk(id);
        if (!instance) throw new Error(`Instancia con id ${id} no encontrada`);
        await instance.destroy();
    }

    public async bulkDelete(modelName: string, options?: DestroyOptions): Promise<number> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        return await model.destroy(options);
    }

    public async count(modelName: string, options?: FindOptions): Promise<number> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        return await model.count(options);
    }

    public async sync(): Promise<Sequelize> {
        return await this.db.sync();
    }

    public async close(): Promise<void> {
        await this.db.close();
    }

    public async syncModels(): Promise<void> {
        await Promise.all(
            Object.values(this.models).map((model) => model.sync())
        );
    }

    public async syncModel(modelName: string): Promise<ModelStatic<Model<any, any>>> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Modelo ${modelName} no encontrado`);
        //@ts-ignore
        return await model.sync();
    }
}

export { dbController };