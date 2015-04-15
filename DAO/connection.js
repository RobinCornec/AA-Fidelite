
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

var selectuserbyid = function (iduser, callback){  

  query = connection.query('SELECT * FROM users WHERE id = "' + iduser + '";', function res(err, rows, field) {  
    callback(rows[0]);  
  });  
};

var selectallusers = function (callback){  

  query = connection.query('SELECT * FROM users;', function res(err, rows, field) {  
      callback(rows);
  });
};

var countvol = function (idUser, date, callback){  
  console.log('DATE+30' + date);
	query = connection.query('SELECT Count(id) AS Count FROM volpassagers WHERE idUser = ' + idUser + ' AND dateVol >="' + date + '" ;', function res(err, rows, field) {	
      callback(rows[0]);
  });
};

var selecttemps = function (idVol ,callback){  

  query = connection.query('SELECT TempsMin FROM vols WHERE id = ' + idVol + ';', function res(err, rows, field) {  
      callback(rows[0]);
  });
};

var selectlastvol = function (idUser, callback){  

  query = connection.query('SELECT idUser, dateVol, Depart, Destination, TempsMin FROM volpassagers p JOIN vols v ON p.idVol = v.id WHERE p.id = (SELECT MAX(id) FROM volpassagers WHERE idUser ='+idUser+');', 
  function res(err, rows, field) {  
      callback(rows[0]);
  });
};

var selectvol = function (callback){  
  query = connection.query('SELECT id, Depart, Destination FROM vols ORDER BY Depart, Destination;', function res(err, rows, field) {  
    callback(rows);
  });
};

var insertvol = function (iduser, idvol, date, callback){  

	query = connection.query('INSERT INTO volpassagers (idVol, idUser, dateVol) VALUES (' + idvol + ', ' + iduser + ', "' + date + '");',
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
exports.selectvol = selectvol;
exports.selectuserbyid = selectuserbyid;
exports.selectallusers = selectallusers;
exports.selecttemps = selecttemps;
exports.insertvol = insertvol;
exports.insertuser = insertuser;
exports.updatetPointF = updatetPointF;
exports.selectlastvol = selectlastvol;
exports.countvol =countvol;