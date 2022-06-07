import { Sequelize } from 'sequelize';
import { config } from './config';

export const sequelize: Sequelize = new Sequelize(config.DB_name, config.DB_user, config.DB_user_pw, {
        host: config.DB_host,
        dialect: "mysql",
});

