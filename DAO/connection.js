
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'airatlantique'
});

var selectuser = function (id, pwd, callback){  
	connection.connect();

	query = connection.query('SELECT * FROM users WHERE Username = "' + id + '"', function res(err, rows, field) {	

    callback(rows[0]);
    
  });
	connection.end();
  
};





exports.selectuser = selectuser;
