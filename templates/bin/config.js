// config.js
module.exports = {
    'cookies': {name : 'AppName', secret: '1234'},
    'proxyRequest': {useproxy: false, user:'', pass: '', host: ''},
    'mongoConfig': {useAuth: false, url: 'mongodb://localhost:27017/AppName', user: '', pass: ''},
    'sqlConfig' : {
        host     : 'localhost',
        user     : 'admin',
        password : 'admin',
        database : 'appName',
        port : 13306,
    },
    'secret' : '1234'
};
