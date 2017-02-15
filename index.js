var Botkit = require('botkit')
var Client = require('node-rest-client').Client;
var options_auth = { user: "admin", password: "Automation@123" };
var client = new Client(options_auth);
var client_slack_in_webhook = new Client();
var args = {
    headers: { "Content-Type": "application/json", "Accept": "application/json"}
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

controller.hears(['list incidents'], ['ambient', 'direct_message','direct_mention','mention'], function (bot, message) {	
  var serviceNowRes;
  var incident_len;
  client.get("https://dev20429.service-now.com/api/now/table/u_slack_incidents?sysparm_limit=10", args, function (data, response) {
	// parsed response body as js object 
	console.log("###############Inside rest call function########################");		
	
	serviceNowRes = data;
	incident_len = data.result.length;
	console.log(serviceNowRes);
	 var i, text = "";
	for (i = 0; i < data.result.length; i++) { 
    		text += data.result[i].sys_id + "\n";
	}
	  
// 	var dt = JSON.stringify(serviceNowRes.result[1].sys_id);
// 	console.log("Reading sys_id from JSON string done.");
	  
	console.log(text);
	console.log("!!!!!!!!!!!!!!!!!!!!!");
	// raw response 
	console.log(response);
	  
// 	 // ---------Posting to slack-----------
// 	  var args = {
// 	  	data: serviceNowRes.sys_id,
//     	  	headers: { "Content-Type": "application/json", "Accept": "application/json"}
//   	  };
// 	  console.log(serviceNowRes.sys_id);
//   	client_slack_in_webhook.post("https://hooks.slack.com/services/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", args, function (data, response) {
//   	// parsed response body as js object 
// 	console.log("+++++++ slack post data  and reponse ++++++++")
//   	console.log(data);
//   	// raw response 
//   	console.log(response);
//   	});
	  bot.reply(message, "Listing incidents \n" + text);
  });
  
})
