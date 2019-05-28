var socket_io = require('socket.io');
var jwtAuth = require('socketio-jwt-auth');
var config = require('../bin/config')
var ioMetrics = require('socket.io-prometheus')

var io = socket_io();
var socketApi = {};

// =================================================
//  Auth middlewares
// =================================================

io.use(jwtAuth.authenticate({
    secret: config.secret,
    algorithm: 'HS256',
    succeedWithoutToken: false
}, function (payload, done) {
    if (payload && payload.id) {
        let id = payload.id
        done(null, id)
    } else {
        return done() // in your connection handler user.logged_in will be false
    }
}));


/**
 * Enable metrics middleware
 */

ioMetrics(io);

// =================================================
//  Functions
// =================================================

socketApi.io = io;

// =================================================
//  Events
// =================================================

io.on('connection', (socket) => {
    console.log('A user connected');
});

module.exports = socketApi;