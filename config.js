/*
User-specific configuration
    ** IMPORTANT NOTE ********************
    * Please ensure you do not interchange your username and password.
    * Hint: Your username is the lengthy value ~ 36 digits including a hyphen
    * Hint: Your password is the smaller value ~ 12 characters
*/ 

// Create the credentials object for export
exports.credentials = {};
exports.sentiment_keyword = "anger";       // keyword to monitor in Twitter
exports.sentiment_analysis_frequency_sec = 10; // analyze sentiment every N seconds

// Watson Speech to Text
// https://www.ibm.com/watson/developercloud/speech-to-text.html
exports.credentials.speech_to_text = {
	url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: '337ee9e9-c855-43fa-ac7c-53e55f2a6486',
    password: 'tkznZrH10zuy'
};

exports.credentials.text_to_speech = {
  url : "https://stream.watsonplatform.net/text-to-speech/api",
  username : "76b25984-82be-46ce-89ee-b9f50575334d",
  password : "lKbFVzaIHfbC"
};

// Watson Tone Analyzer
// https://www.ibm.com/watson/developercloud/tone-analyzer.html
exports.credentials.tone_analyzer = {
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  username: "3d6d192b-3f35-484d-a3f5-757eb4e4c0df",
  password: "NKHW44Dr3vo1"
};

// Watson Visual Recognition 
exports.credentials.visual_recognition = {  
  url: "https://gateway-a.watsonplatform.net/visual-recognition/api",
  note: "It may take up to 5 minutes for this key to become active",
  api_key: "ad1ce27744bf4a7cf511bc694d3c26682d399db8"
};


