import { Sequelize, Dialect } from 'sequelize';

const env = process.env.NODE_ENV || "development";

const DB_NAME = process.env.DB_NAME || 'test-db';
const DB_USER = process.env.DB_USER || 'root';
const DB_HOST = process.env.DB_HOST
const DB_PASS = process.env.DB_PASS || 'root12345';

//FIXME Why does this not work?
// const sequelize = new Sequelize(config[env]);
const sequelize = new Sequelize(
    'test-db',
    'root',
    'root12345',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

export default sequelize;