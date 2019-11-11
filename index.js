const LastFmNode = require('lastfm').LastFmNode;
const Discord = require('discord.js');
const client = new Discord.Client();
const exitHook = require('exit-hook');
const fs = require('fs');

const rawCredentials = fs.readFileSync('credentials.json');
const credentials = JSON.parse(rawCredentials);

const lastfm = new LastFmNode({
  api_key: credentials.API_KEY, 
  secret: credentials.SECRET_KEY,
});

const trackStream = lastfm.stream(credentials.LASTFM_USERNAME);
client.login(credentials.TOKEN);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	trackStream.on('nowPlaying', function(track) {
		const song = track.artist['#text'] + " - " + track.name;

		client.user.setActivity(song, { type: 'LISTENING' });
	});
	
	trackStream.on('stoppedPlaying', function(track) {
		 console.log('Stopped playing: ' + track.name);
		 client.user.setActivity(null);
	});
});


trackStream.start();

process.on('exit', function() {
	client.user.setActivity(null);
});

exitHook(() => {
	trackStream.stop();
    client.user.setActivity(null);
});
