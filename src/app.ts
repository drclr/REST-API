import express from 'express';
import * as path from 'path';

import { Request, Response, NextFunction } from 'express';
import { sequelize } from "./connection";
import { userRoutes } from './routes/user';
import { articleRoutes } from './routes/article';
import { commentRoutes } from './routes/comment';

const application = express();

Promise.all([sequelize.authenticate(), sequelize.sync()])
        .then(() => {
                console.log('connected to MySQL DB and synchronisation between all defined models and DB');

                application.use('/images', express.static(path.join(__dirname, 'images')));
                application.use(express.json());

                application.use((req: Request, res: Response, next: NextFunction) => {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
                        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
                        next();
                });
                application.use('/api/auth', userRoutes);
                application.use('/api/auth/article', articleRoutes);
                application.use('/api/auth/comment', commentRoutes);
        })
        .catch((err: Error) => {
                application.use((req: Request, res: Response) => res.status(500).json({ message: 'DB error' }));
                console.error('Error: ', err.message);
        });

export default application;