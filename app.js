const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require('cheerio');
const got = require('got');

const app = express();
app.enable("trust proxy");

app.use(bodyParser.json());

const url = 'https://en.wikipedia.org/wiki/Claude_Mandil';

const response = await got(url);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});