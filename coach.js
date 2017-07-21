// HACK++ is the NUMBER ONE TEAM

var TJBot = require('tjbot');
var config = require('./config');

var totalWordCount = 0;
var WPM = 0;
var elapsedTime = 5;
var timerIdx = 0;
var prevAvg = 0;
var speech = "";

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
		speakerDeviceId: "plughw:1,0",
		voice: 'en-US_MichaelVoice'
	}
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
var tjColors = tj.shineColors();
tj.speak("Hi, my name is HackBot, made by Hack++, "
+ "I'm going to be your speech coach, when you are ready, start talking. When you're finished, say coach and I will provide feedback");
tj.raiseArm();

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
var colors = {};
tjColors.forEach(function(color) {
    colors[color] = 1;
});

/*
* Tone analyzer
*/ 

'use strict';

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const tone_analyzer = new ToneAnalyzerV3({
  username: '3d6d192b-3f35-484d-a3f5-757eb4e4c0df',
  password: 'NKHW44Dr3vo1',
  version_date: '2016-05-19'
});

// listen for speech
tj.listen(function(msg) {
	speech += msg;
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
	var greet = msg.indexOf("hi hackbot") >= 0;
	var analyze = msg.indexOf("coach") >= 0;
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
	
	if (analyze){
		//window.setTimeout(checkFlag, 2000);
		console.log(speech);
		tone_analyzer.tone({ text: speech}, function(err, tone) {
			
		  if (err) {
			console.log(err);
		  }
		  else {
			//analysis = JSON.stringify(tone,null,2);
			emotion = tone.document_tone.tone_categories[0].tones[0].tone_name;
			language = tone.document_tone.tone_categories[1].tones[0].tone_name;
			social = tone.document_tone.tone_categories[2].tones[0].tone_name;
			console.log("emotion " + emotion + " lang " + language + " social " + social);
			//console.log('tone endpoint:');
			//console.log(JSON.stringify(tone, null, 2));
						//analysis = JSON.stringify(tone,null,2);
			emotion = tone.document_tone.tone_categories[0]
			lang = tone.document_tone.tone_categories[1]
			social = tone.document_tone.tone_categories[2]
			current_max_e = emotion.tones[0].score;
			current_id_e = emotion.tones[0].tone_name;
			current_max_l = lang.tones[0].score;
			current_id_l = lang.tones[0].tone_name;
			current_max_s = social.tones[0].score;
			current_id_s = social.tones[0].tone_name;
			for (var i = 1; i < 5; i++){
				if (emotion.tones[i].score > current_max_e) {current_max_e = emotion.tones[i].score; current_id_e = emotion.tones[i].tone_name;}
				if (i < 3){
					if (lang.tones[i].score > current_max_l) {current_max_l = lang.tones[i].score; current_id_l = lang.tones[i].tone_name;}
				}
				if (social.tones[i].score > current_max_s) {current_max_s = social.tones[i].score; current_id_s = social.tones[i].tone_name;}
			}
			console.log("emotion " + current_max_e  + " " + current_id_e + " lang " + current_max_l + " " + current_id_l + " social " + current_max_s + " " + current_id_s);
		  }
		  tj.speak("Okay. Your emotions were " + current_id_e + ", your speech type was " + current_id_l + ", and the personality trait that came out was, " + current_id_s);
		});
		speech = " ";
	}
});

function tj_state(state){
    if(state !='continue'){
       window.setTimeout(checkFlag, 2000); /* this checks the flag every 100 milliseconds*/
    }
}

/*
*  Timing
*/ 

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
	if (result < 120){
		tj.shine('blue');
		tj.lowerArm();
	}
	else if (result > 200) {
		tj.shine('red');
		tj.armBack();
	}
	else{
		tj.shine('green');
	}
}
