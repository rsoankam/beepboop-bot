var Botkit = require('botkit')
var Client = require('node-rest-client').Client;
var client = new Client();
var args = {
    headers: { "Content-Type": "application/json", "Accept": "application/json", "auth": "admin:Automation@123"}
};

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hi'], ['ambient', 'direct_message','direct_mention','mention'], function (bot, message) {
	client.get("https://dev20429.service-now.com/api/now/table/u_slack_incidents?sysparm_limit=10", function (data, response) {
		// parsed response body as js object 
		console.log(data);
    var testRes = data.toString();
		// raw response 
		console.log(response);
	});	
  bot.reply(message, testRes)
})
