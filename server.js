
var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var reqmysql = require("./DAO/connection");
var md5 = require('MD5');
var moment = require('moment');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
var msg = "";
var sess;

moment().format();

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
				sess.id = result.id;
				sess.nom = result.Nom;
				sess.prenom = result.Prenom;
				sess.pf = result.pointFidelite;
				sess.admin = result.admin;
				if (md5(pwd) == result.Password) {
			        console.log(result.Prenom + " " + result.Nom + " s'est connecté");
			        if (sess.admin == 1) {
						res.redirect('/admin');
			        }
		    		else{
		    			res.redirect('/mainPage');   			 
		    		};       		
	    		}
			 	else{
		    		msg = "Username ou Mot de passe incorrect";
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
	console.log(sess.id);
	reqmysql.selectlastvol(sess.id,function callback (result){
 		var date =  moment().subtract(30, 'day');
 		date =  moment(date, "ddd MMM DD YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
		console.log(result);
		var lastvol = moment(result.dateVol, "ddd MMM DD YYYY HH:mm:ss").format("DD MMMM YYYY");
		var trajet = result.Depart + " -> " + result.Destination;

		reqmysql.countvol(sess.id, date, function callback (resultat){
			var count = resultat.Count;
			res.render('mainPage.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf, vol: lastvol, trajet: trajet, count: count});
		})
	});
})

app.get('/admin', function(req, res){
	sess=req.session;
	reqmysql.selectallusers(function callback (result){
			res.render('mainPageAdmin.ejs', {nom: sess.nom, prenom: sess.prenom, pointFidelite: sess.pf, users: result});  
		});
	

});

app.post('/admin', function(req, res){
	sess=req.session;

	if (req.body.nomPassager) {
		var date = new Date();

		var nomPassager = req.body.nomPassager;
		var idVol = req.body.idVol;
			date = req.body.date + " " + req.body.heure + ":" + req.body.minute + ":00";
		var pfnew;
		console.log("id du vol : " + idVol);
		var expDate = moment(date, "MM/DD/YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');

		reqmysql.insertvol(nomPassager, idVol, expDate, function callback (result){
			console.log(result);
		});

		reqmysql.selecttemps(idVol, function callback (result){

			var tempsMin = result.TempsMin;

			reqmysql.selectuserbyid(nomPassager, function callback (result){

				pfnew = (result.pointFidelite + tempsMin);
				console.log(result.Prenom + " " + result.Nom + " a maintenant " + pfnew + " points de fidélité");
				reqmysql.updatetPointF(nomPassager, pfnew, function callback (result){
					console.log(result);
					res.redirect('/admin');       
				});

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
			res.redirect('/admin');
		});
	};
})

.use(express.static(__dirname + '/'))
.listen(8080);