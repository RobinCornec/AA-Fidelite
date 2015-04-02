
var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var reqmysql = require("./DAO/connection");
var md5 = require('MD5');
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
	if (sess.nom) {
		reqmysql.selectuser(sess.login, function callback (result){	
			sess.pf = result.pointFidelite;
			if (sess.admin == 1) {
				res.redirect('/admin');
	        }
    		else{
    			res.redirect('/mainPage');   			 
    		}; 		               			   		
		});
	}
	else{
		msg = "Veuillez vous connecter";
		res.redirect('back');
		console.log(msg);
	};
    
});

app.post('/connect', function(req, res){
	sess=req.session;
	if (req.body.identifiant) {
		sess.login = req.body.identifiant;
		var pwd = req.body.password;
		reqmysql.selectuser(sess.login, function callback (result){	
			try{
				sess.nom = result.Nom;
				sess.prenom = result.Prenom;
				sess.pf = result.pointFidelite;
				sess.admin = result.admin;
				if (md5(pwd) == result.Password) {
			        console.log(result.Prenom + " " + result.Nom + " s'est connecté");
			        console.log(sess.admin);
			        if (sess.admin == 1) {
						res.redirect('/admin');
			        }
		    		else{
		    			res.redirect('/mainPage');   			 
		    		};       		
	    		}
			 	else{
		    		msg = "Mot de passe incorrect";
					res.redirect('back');
		    		console.log(msg);
	    		};

			 }catch(msg){
			 	msg = "Username incorrect";
				res.redirect('back');
	    		console.log(msg);
			 } 	
		});
	}
	else{
		msg = "Veuillez vous connecté";
		res.redirect('back');
		console.log(msg);
	};

});
app.get('/mainPage', function(req, res){
	sess=req.session;
	res.render('mainPage.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf});
})

app.get('/admin', function(req, res){
	sess=req.session;
	res.render('mainPageAdmin.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf});  

});

app.post('/admin', function(req, res){
	sess=req.session;

	if (req.body.idPassager) {
		var idPassager = req.body.idPassager;
		var idVol = req.body.idVol;
		var date = req.body.date;
		var pfnew;
		reqmysql.insertvol(idPassager, idVol, function callback (result){
			console.log(result);
		});
		reqmysql.selecttemps(idVol, function callback (result){
			pfnew = (sess.pf + result.TempsMin);
			sess.pf = pfnew;
			console.log(sess.prenom + " " + sess.nom + " a maintenant " + sess.pf + " points de fidélité");
			reqmysql.updatetPointF(idPassager, pfnew, function callback (result){
				console.log(result);
				res.render('mainPageAdmin.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf});       
			});
		});	
	}
	else if (req.body.login) {
		login = req.body.login;
		pwd = md5(req.body.pwd);
		name = req.body.name;
		lastname = req.body.lastname;
		status = req.body.status;

		reqmysql.insertuser(login, pwd, name, lastname, status, function callback (result){
			console.log(result);
			res.render('mainPageAdmin.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf});
		});
	};
})

.use(express.static(__dirname + '/'))
.listen(8080);

