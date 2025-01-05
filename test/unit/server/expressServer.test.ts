import { ExpressServer } from "../../../src/infrastructure/server/express/expressServer";
import express from "express";

const app = express();

describe("ExpressServer", () => {
    it("should be instantiated", () => {
        const expressServer = new ExpressServer(app);
        expressServer.start({ port: 3000 });
        expect(expressServer).toBeInstanceOf(ExpressServer);
    });
});