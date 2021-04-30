const express = require("express");
const bodyParser = require("body-parser");

const { errorHandler } = require("./controllers/error");
const routes = require("./routes/index");

const app = express();
app.enable("trust proxy");

app.use(bodyParser.text())
app.use("/", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});