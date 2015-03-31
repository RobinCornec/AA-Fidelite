
var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var reqmysql = require("./DAO/connection");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
var msg = "";
var sess;

app.use(session({secret: 'todotopsecret'}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get('/', function(req, res) { 
	sess=req.session;
	sess.test="vtff ca marche";
    res.render('index.ejs', {msg: msg});
});


app.post('/connect', function(req, res){
	sess=req.session;
	var login = req.body.identifiant;
	var pwd = req.body.password;
	reqmysql.selectuser(login, pwd, function callback (result){
	sess=req.session;		
		try{

			if (login == result.Username && pwd == result.Password) {
		        console.log(result.Prenom + result.Nom + "s'est connecté");
				res.render('mainPage.ejs', {nom: result.Nom, prenom: result.Prenom, test: sess.test});
    		}
		 	else{
	    		msg = "Mot de passe incorrect";
	    		res.render('index.ejs', {msg: msg});
    		};

		 }catch(msg){
		 	var msg = "Cette Username n'existe pas";
			res.render('index.ejs', {msg: msg});
		 	console.log(msg);
		 } 	
	});
	
})

.use(express.static(__dirname + '/')) ;

app.listen(8080);

