var soundplayer = require("../index.js")

var options = {
    filename: "preview.mp3"
}

var player = new soundplayer(options)
player.play();

player.on('complete', function() {
    console.log('Done with playback!');
});

player.on('error', function(err) {
    console.log('Error occurred:', err);
});
