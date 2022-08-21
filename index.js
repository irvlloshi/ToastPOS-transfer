const Nexmo = require('nexmo')
require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
})

app.use(bodyParser.json());

app.get('/webhooks/answer', (req, res) => {
	res.json(mainMenu(req));
});

app.post('/webhooks/events', (req, res) => {
	console.log(req.body);
	res.sendStatus(204);
});

app.post('/webhooks/dtmf', (req, res) => {
	let actions = [];
	let ncco = [];
	switch (req.body.dtmf.digits) {
		case '1':
			actions.push({
				action: 'talk',
				style: 21,
				premium: true,
				text: `Please enter the 5 digit zip code where you are looking for services.`
			});
			break;
		case '2':
			actions.push({
				action: 'talk',
				style: 21,
				premium: true,
				text: `Our opt-in link is on its way.`
			});
			break;
		case '3':
			actions.push({
				action: 'talk',
				style: 21,
				premium: true,
				text: `Please tell us what services are you looking for.`
			});
			break;
		case '4':
			actions.push({
				action: 'connect',
				from: 16032175873,
				endpoint: [{
					type: 'phone',
      				number: 18576540469
				  }],
				});
		}
	ncco = actions.concat(mainMenu(req));

	console.log(ncco);

	res.json(ncco);
});

function mainMenu (req) {
	return [
		{
			action: 'talk',
			bargeIn: true,
			style: 21,
			premium: true,
			text: 'Thanks for calling eLocal. Our calls may be recorded for quality purposes. To search for services by Zip Code, please press one. To search for services by category, please press two. To opt-in to receive information in the future, please press three. To be transfered to an agent, press four.'

		},
		{
			action: 'input',
			type: [ 'dtmf' ],
			dtmf: {
				maxDigits: 1,
			},
			eventUrl: [ `${req.protocol}://${req.get('host')}/webhooks/dtmf` ],
		},
	];
}

app.listen(8000, () => {
  console.log('Server listening on localhost.')
})