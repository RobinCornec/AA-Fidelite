
var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var reqmysql = require("./DAO/connection");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();

//app.use(express.bodyParser());
app.use(session({secret: 'todotopsecret'}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


app.get('/', function(req, res) { 
    res.render('index.ejs');
});


app.post('/', function(req, res){
	var id = req.body.identifiant;
	var pwd = req.body.password;
	//var dateValue = req.body.checkDate;
	alert(id);
	//reqmysql.insertsql(titleart, contentart);

})

.use(express.static(__dirname + '/')) ;

app.listen(8080);

