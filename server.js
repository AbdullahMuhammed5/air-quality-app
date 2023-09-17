const app = require("./src/app.js");
const config = require("./config/index.js");
const mongoose = require('mongoose');

const port = config.port || 3000;

const DB = config.dbUrl
    .replace('<USER>', config.dbUser)
    .replace('<PASSWORD>', config.dbPassword);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!'))

// Start the Express.js server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});