
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'airatlantique'
});

var selectuser = function (id){
	connection.connect();

	connection.query('SELECT * FROM users WHERE Username = "' + id + '"', function(err, rows, fields) {
  if (!err){
  	//console.log(rows[0].Nom);
    return rows[0].Nom;
  }  	
  else
    console.log('Error while performing Query.');
});

	connection.end();
};


exports.selectuser = selectuser;
