
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'airatlantique'
});

var selectuser = function (login, callback){  

	query = connection.query('SELECT * FROM users WHERE Username = "' + login + '";', function res(err, rows, field) {	
    callback(rows[0]);  
  });  
};

var selecttemps = function (idVol, callback){  

	query = connection.query('SELECT TempsMin FROM vols WHERE id = ' + idVol + ';', function res(err, rows, field) {	
      callback(rows[0]);
  	});
  
};

var insertvol = function (iduser, idvol, callback){  

	query = connection.query('INSERT INTO volpassagers (idVol, idUser) VALUES (' + idvol + ', ' + iduser + ');',
	 function res(err) {	
    	if (!err) {
    		var msg = "insert vol is done !";
    		callback(msg);
    	}
    	else{
    		callback(err);
    	};
  });
  
};

var insertuser = function (login, pwd, name, lastname, admin, callback){  

  query = connection.query('INSERT INTO users (Nom, Prenom, Username, Password, admin) VALUES ("' + 
    lastname + '", "' + name + '", "' + login + '", "' + pwd + '", "' + admin + '");',
   function res(err) {  
      if (!err) {
        var msg = "insert user " + name + " " + lastname + " is done !";
        callback(msg);
      }
      else{
        callback(err);
      };
  });
};

var updatetPointF = function (iduser, pf, callback){  

	query = connection.query('UPDATE users SET pointFidelite = '+ pf +' WHERE id = "' + iduser + '";',
	 function res(err) {	
    	if (!err) {
        var msg = "update pf is done !";
    		callback(msg);
    	}
    	else{
    		callback(err);
    	};
  });
};

exports.selectuser = selectuser;
exports.selecttemps = selecttemps;
exports.insertvol = insertvol;
exports.insertuser = insertuser;
exports.updatetPointF = updatetPointF;