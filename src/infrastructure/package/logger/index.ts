import { NextFunction, Request, Response } from 'express';
import path from 'path';
import util from 'util';

enum COLORS {
    error = '\x1b[31m',
    warn = '\x1b[33m',
    info = '\x1b[34m',
    reset = '\x1b[0m'
}

class Logger {
    private originalConsoleError = console.error;
    private originalConsoleWarn = console.warn;
    private originalConsoleInfo = console.info;
    private basePath: string;

    constructor() {
        this.basePath = process.cwd();
     }

    private log(level: "error" | "warn" | "info", message: string | object) {
        const colorCode = COLORS[level];
        const resetCode = COLORS.reset;

        let messageString: string;
        if (typeof message === 'object') {
            messageString = util.inspect(message, { colors: true, depth: null });
        } else {
            messageString = message;
        }

        const callerFilePath = this.getCallerFilePath(level);

        const loggerMessage = `${this.timeStamp()} [${colorCode}$${level.toUpperCase()}${resetCode}] ${colorCode}${messageString}${resetCode} (${callerFilePath})`;

        switch (level) {
            case "error":
                this.originalConsoleError(loggerMessage);
                break;
            case "warn":
                this.originalConsoleWarn(loggerMessage);
                break;
            case "info":
                this.originalConsoleInfo(loggerMessage);
                break;
        }
    }


    error(message: string | object) {
        this.log("error", message);
    }

    warn(message: string | object) {
        this.log("warn", message);
    }

    info(message: string | object) {
        this.log("info", message);
    }

    private timeStamp() {
        return new Date().toLocaleString();
    }

    private getCallerFilePath(level: "error" | "warn" | "info"): string {
        const stack = new Error().stack || '';
        const stackLines = stack.split('\n');
        const callerLine = stackLines[4];

        const match = callerLine.match(/\((.*):\d+:\d+\)/);
        if (match) {
            const fullPath = match[1];
            if (level === "error") {
                const relativePath = path.relative(this.basePath, fullPath);
                return relativePath;
            } else {
                return path.basename(fullPath);
            }
        }
        return 'Unknown file';
    }

    middleware(req: Request, res: Response, next: NextFunction) {
        const logger = new Logger();
        logger.info({
            method: req.method,
            url: req.url,
            timestamp: logger.timeStamp()
        });
        next();
    }
}

export default new Logger();
