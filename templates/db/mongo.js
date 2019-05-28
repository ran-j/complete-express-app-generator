var mongoose = require('mongoose');

//seta endereço do BD
if (config.mongoConfig.useAuth) {
    mongoose.connect(config.mongoConfig.url, {
        user: config.mongoConfig.user,
        pass: config.mongoConfig.pass,
        useCreateIndex: true,
        useNewUrlParser: true,
        reconnectInterval: 5000,
        reconnectTries: 60
    });
} else {
    mongoose.connect(config.mongoConfig.url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        reconnectInterval: 5000,
        reconnectTries: 60
    });
}

//Abre a conexão com o BD
var db = mongoose.connection;

//handle de erro do mongo
db.on('error', console.error.bind(console, 'connection error:'));
db.on('reconnected', function () {
    console.log("MongoDB reconnected")
});
//disconecting event
db.on('disconnected', function () {
    console.log("MongoDB disconnected")
});
//db open
db.once('open', function () {
    console.log('Conected with ' + config.mongoConfig.url);
});

module.exports = db