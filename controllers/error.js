// source: https://expressjs.com/en/guide/error-handling.html
function errorHandler(err, req, res, next) {
    res.status(500).json({ error: err });
}

module.exports = {
    errorHandler
};

