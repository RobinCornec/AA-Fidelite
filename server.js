
var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var reqmysql = require("./DAO/connection");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();

app.use(session({secret: 'todotopsecret'}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get('/', function(req, res) { 
    res.render('index.ejs');
});


app.post('/', function(req, res){
	var id = req.body.identifiant;
	var pwd = req.body.password;
	var nom = reqmysql.selectuser(id);
	console.log(nom);
	res.render('mainPage.ejs', {nom: nom});
})

.use(express.static(__dirname + '/')) ;

app.listen(8080);

