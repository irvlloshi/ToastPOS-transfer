const app = require('express')();
const bodyParser = require('body-parser');

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
				text: `Our link is on the way, if there is anything else we can help you with press 1 to return to the main menu or press 2 to speak with someone in our restaurant`
			});
			break;
		case '2':
			actions.push({
				action: 'connect',
				from: 16032064794, // Replace with your Nexmo Number
				endpoint: [{
				type: 'phone',
				number: 18576540469}] // Replace with external cell phone number
			});
			break;
		case '3':
			actions.push({
				action: 'talk',
				style: 21,
				premium: true,
				text: `We are open 7am to 3pm Monday through Friday and 8am until 4pm Saturday and Sunday. if there is anything else we can help you with press 1 to return to the main menu or press 2 to speak with someone in our restaurant`
			});
			break;
		case '4':
			actions.push({
				action: 'connect',
				from: 18576540469, // Replace with caller's cell phone number so that it is passed during time of transfer
				endpoint: [{
				type: 'vbc',
				extension: 599}] // Replace with your extension
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
			text: 'Thanks for calling Toast Restaurants, we are open until 10pm today and are located at 555 Washington Street. The fastest way to order is through our website. \
					If you would like us to send you a link to our website press 1. \
					If you would like to place a catering order press 2. To hear our schedule for this week press 3.\
					To speak with someone in the restaurant press 4 and we will connect you.'
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