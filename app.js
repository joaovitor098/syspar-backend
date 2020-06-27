var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var notificacao = require("./routes/notificacao");
var fornecedor = require("./routes/fornecedor");
var peca = require("./routes/peca");
var maquina = require("./routes/maquina");
var usuario = require("./routes/usuario");
var os = require("./routes/os");
var corsConfig = require("cors");
var app = express();

app.use(corsConfig());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", notificacao);
app.use("/", maquina);
app.use("/", peca);
app.use("/", fornecedor);
app.use("/", usuario);
app.use("/", os);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
