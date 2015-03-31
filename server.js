
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
	msg="";
    res.render('index.ejs', {msg: msg});
});


app.post('/connect', function(req, res){
	var id = req.body.identifiant;
	var pwd = req.body.password;
	reqmysql.selectuser(id, pwd, function callback (result){
			
		try{

			if (id == result.Username && pwd == result.Password) {
		        console.log(result.Nom);
				console.log(result.Prenom);
				res.render('mainPage.ejs', {nom: result.Nom, prenom: result.Prenom});
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

