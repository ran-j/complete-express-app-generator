var mysql = require('mysql');

var connection = mysql.createConnection(config.sqlConfig);
 
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  } 
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection