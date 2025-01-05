import logger from "@/infrastructure/package/logger";
import { Request  , Response} from "express";



const authRoutes = {
    post: [
        {
            path: '/auth/login',
            method: 'POST',
            handler: () => { },
            middlewares: [],
            name: 'Login',
            description: 'Login a user'
        }
    ],
    get: [
        {
            path: '/auth/logout',
            method: 'GET',
            handler: (req:Request, res:Response) => {
                logger.error('Logout');
                res.status(200).json({ message: 'Logout successful' });
            },
            middlewares: [],
            name: 'Logout',
            description: 'Logout a user'
        }
    ]
}

export default authRoutes;