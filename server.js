
var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var reqmysql = require("./DAO/connection");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
var msg = "";
var sess;

app.use(session({secret: 'user'}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get('/', function(req, res) { 
	sess=req.session;
    res.render('index.ejs', {msg: msg});
});

app.get('/connect', function(req, res) { 
	sess=req.session;
	pwd = "";
	if (sess.nom) {
		reqmysql.selectuser(sess.login, pwd, function callback (result){	
			sess.pf = result.pointFidelite;
			res.render('mainPage.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf});    		
		});
	}
	else{
		msg = "Veuillez vous connecter";
		res.render('index.ejs', {msg: msg});
		console.log(msg);
	};
    
});

app.post('/connect', function(req, res){
	sess=req.session;
	if (req.body.identifiant) {
		sess.login = req.body.identifiant;
		var pwd = req.body.password;
		reqmysql.selectuser(sess.login, pwd, function callback (result){	
			try{
				sess.nom = result.Nom;
				sess.prenom = result.Prenom;
				sess.pf = result.pointFidelite;
				if (sess.login == result.Username && pwd == result.Password) {
			        console.log(result.Prenom + " " + result.Nom + " s'est connecté");
					res.render('mainPage.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf});
	    		}
			 	else{
		    		msg = "Mot de passe incorrect";
		    		res.render('index.ejs', {msg: msg});
		    		console.log(msg);
	    		};

			 }catch(msg){
			 	msg = "Cette Username n'existe pas";
				res.render('index.ejs', {msg: msg});
			 	console.log(msg);
			 } 	
		});
	}
	else if (req.body.idPassager) {
		var idPassager = req.body.idPassager;
		var idVol = req.body.idVol;
		var date = req.body.date;
		var pfnew;
		reqmysql.insertvol(idPassager, idVol, date, function callback (result){
			console.log(result);
		});
		reqmysql.selecttemps(idVol, function callback (result){
			pfnew = (sess.pf + result.TempsMin);
			sess.pf = pfnew;
			console.log(sess.prenom + " " + sess.nom + " a maintenant " + sess.pf + " points de fidélité");
			reqmysql.updatetPointF(idPassager, pfnew, function callback (result){
				console.log(result);
				res.render('mainPage.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf});   			
			});
		});
		
	}
	else{
		msg = "Veuillez vous connecté";
		res.render('index.ejs', {msg: msg});
		console.log(msg);
	};

})


.use(express.static(__dirname + '/'))
.listen(8080);

