const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    dbUrl: process.env.DATABASE_URL,
    dbUser: process.env.DATABASE_USER,
    dbPassword: process.env.DATABASE_PASSWORD,
    iqairBaseUrl: process.env.IQAIR_BASE_URL,
    iqairApiKey: process.env.IQAIR_API_KEY,
}