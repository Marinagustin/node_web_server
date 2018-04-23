const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// to fix heroku port issue (Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 60 seconds of launch)
const port = process.env.PORT || 3000;

var app = express();
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("getCurrentYear", () => {
	return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (message) => {
	return message.toUpperCase();
});
app.set('View Engine', hbs);
/* creating a middleware */

app.use((req, res, next) => {
	var date = new Date().toString();
	var log = `${date}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if(err){
			console.log('Unable to append to log file');
		}
	});
	next(); // without calling this method it will not proceed to any method which we are trying to hit from browser

});

// To move the application completely into maintaince
// app.use((req, res, next) => {
// 	res.render('maintainance.hbs');
// });

// Used to Initialize the require folders
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	var details = {
		name: "Marina",
		Age: "25",
		Place: "Bangalore",
		likes: [
			'reading',
			'sleeping',
			'chatting'
		],
		pageTitle: 'Welcome to home page' ,
		welcomeMessage: 'Welcome to Home Dashboard'
	}
	// Send helloworld when "/" is hit and returns and html response
	//res.send('<h1>Hello Express</h1>'); 
	/* For JSON response
	res.send(details);
	*/
	res.render('home.hbs',details)
});


app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to Fetch Request'
	});
});

app.listen(port, (err) => {
	if(err) {
		console.log("Unable to connect to port")
	}
});