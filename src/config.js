const dotenv = require('dotenv');
dotenv.config();

const DB = process.env.NODE_ENV.toString().trim() === 'development' ? process.env.DB_CONECTION : process.env.DB_ATLAS_CONECTION

const PREFIX = "/api/";

let JWT = {
    secret: "PeShVkYp3s6v9y$B&E)H@McQfTjWnZq4",
    options: {
        expiresIn: 60 * 60 * 24 * 365,
    }
  };


module.exports = {
    DB,
    path: (value)=>`${PREFIX}${value || ''}`,
    JWT
}