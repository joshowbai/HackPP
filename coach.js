// HACK++ is the NUMBER ONE TEAM

var TJBot = require('tjbot');
var config = require('./config');

var totalWordCount = 0;
var WPM = 0;
var elapsedTime = 5;
var timerIdx = 0;
var prevAvg = 0;

// obtain our credentials from config.js
var credentials = config.credentials;

// these are the hardware capabilities that our TJ needs for this recipe
var hardware = ['led', 'microphone'];

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    }/*,
    listen: {
		microphoneDeviceId: "plughw:1,0"
	}*/
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
var tjColors = tj.shineColors();

console.log("This is an early attempt at calculating WPM based on user input. This initial draft should output the number of words in each individual message.");
tj.armBack();
console.log("Here are all the colors I understand:");
console.log(tjColors.join(", "));

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
var colors = {};
tjColors.forEach(function(color) {
    colors[color] = 1;
});

// listen for speech
tj.listen(function(msg) {
    var stringIn = msg.toLowerCase();
    var wordCount = stringIn.split(" ").length;
    totalWordCount += wordCount;
    var containsTurn = msg.indexOf("turn") >= 0;
    var containsChange = msg.indexOf("change") >= 0;
    var containsSet = msg.indexOf("set") >= 0;
    var containsLight = msg.indexOf("the light") >= 0;
    var containsDisco = msg.indexOf("disco") >= 0;
    var containsWave = msg.indexOf("wave") >= 0;
    var dance = msg.indexOf("dance") >= 0;

    if ((containsTurn || containsChange || containsSet) && containsLight) {
        // was there a color uttered?
        var words = msg.split(" ");
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (colors[word] != undefined || word == "on" || word == "off") {
                // yes!
                tj.shine(word);
                break;
            }
        }
    }else if (containsWave || dance){
		if (dance){
			for(var i = 0; i < 3; i++){
				tj.lowerArm();
				tj.raiseArm();
			}
		}
		else{ tj.wave(); }
	}
});

var timingLoop = setInterval(function() {
  if(totalWordCount > 0){
    WPM = totalWordCount / elapsedTime; //We've gotten words per second now
    elapsedTime = 5;
    timerIdx++;
  }else{
    elapsedTime += 5;
  }
  WPM = WPM*60; //Was words per second, now converted into  words per minute.
  console.log("Calculating WPM to equal ", WPM, " words per minute. Should be 145-160 for the ideal professional speaker.\n\tYour average time overall is ", (WPM+prevAvg)/timerIdx, " words per minute.");
  prevAvg = prevAvg+WPM;
  totalWordCount = 0; 
}, 5000);

function respond(response){
	switch(response){
		case "slow":
			tj.lowerArm();
		case "fast":
			tj.raiseArm();
		case "hesitation":
			tj.wave();
		default:
			break;
	}
}
// Yoel can push now
