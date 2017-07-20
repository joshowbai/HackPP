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
var hardware = ['led', 'microphone','servo','speaker'];

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    },
    speak: {
		speakerDeviceId: "plughw:1,0"
	}
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
var tjColors = tj.shineColors();
tj.speak("Hi, my name is HackBot, made by Hack++, "
+ "I'm going to be your speech coach");
tj.raiseArm();
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
  var resultant = (WPM+prevAvg)/timerIdx;
  console.log("Calculating WPM to equal ", WPM, " words per minute. Should be 145-160 for the ideal professional speaker.\n\tYour average time overall is ", resultant, " words per minute.");
  prevAvg = prevAvg+WPM;
  respond(WPM);
  totalWordCount = 0; 
}, 5000);

function respond(result){
	if (result < 140){
		tj.speak("speed up a bit");
		tj.shine('off');
		tj.lowerArm();
	}
	else if (result > 165) {
		tj.speak('slow down a bit ');
		tj.shine('off');
		tj.armBack();
	}
	else{
		tj.shine('red');
	}
}
