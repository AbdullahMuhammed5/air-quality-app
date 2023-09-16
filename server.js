const app = require("./src/app.js");
const config = require("./src/config");

const port = config.port || 3000;

// Start the Express.js server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});