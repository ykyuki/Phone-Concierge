'use strict';

const record = require('node-record-lpcm16');
const Speaker = require('speaker');
const path = require('path');
const GoogleAssistant = require('google-assistant');
const speakerHelper = require('./speaker-helper');

const config = {
  auth: {
    keyFilePath: path.resolve(__dirname, 'key.json'),
    savedTokensPath: path.resolve(__dirname, 'tokens.json'), // where you want the tokens to be saved
  },
  conversation: {
    audio: {
      sampleRateOut: 24000, // defaults to 24000
    },
    lang: 'ja-JP', // defaults to en-US, but try other ones, it's fun!
    deviceLocation: {
      coordinates: { // set the latitude and longitude of the device
        latitude: 35.6895014,
        longitude: 139.6917337,
      },
    },
  },
};

const startConversation = (conversation) => {
  console.log('Say something!');
  let openMicAgain = false;

  // setup the conversation
  conversation
    // send the audio buffer to the speaker
    .on('audio-data', (data) => {
      speakerHelper.update(data);
    })
    // done speaking, close the mic
    .on('end-of-utterance', () => record.stop())
    // just to spit out to the console what was said (as we say it)
    .on('transcription', data => console.log('Transcription:', data.transcription, ' --- Done:', data.done))
    // what the assistant said back
    .on('response', text => console.log('Assistant Text Response:', text))
    // if we've requested a volume level change, get the percentage of the new level
    .on('volume-percent', percent => console.log('New Volume Percent:', percent))
    // the device needs to complete an action
    .on('device-action', action => console.log('Device Action:', action))
    // once the conversation is ended, see if we need to follow up
    .on('ended', (error, continueConversation) => {
      if (error) console.log('Conversation Ended Error:', error);
      else if (continueConversation) openMicAgain = false;
      else console.log('Conversation Complete');
    })
    // catch any errors
    .on('error', (error) => {
      console.log('Conversation Error:', error);
    });

  // pass the mic audio to the assistant
  const mic = record.start({ threshold: 0, recordProgram: 'arecord' });
  mic.on('data', data => conversation.write(data));

  // setup the speaker
  const speaker = new Speaker({
    channels: 1,
    sampleRate: config.conversation.audio.sampleRateOut,
  });
  speakerHelper.init(speaker);
  speaker
    .on('open', () => {
      console.log('Assistant Speaking');
      speakerHelper.open();
    })
    .on('close', () => {
      console.log('Assistant Finished Speaking');
      if (openMicAgain) assistant.start(config.conversation);
    });
};

// setup the assistant
const assistant = new GoogleAssistant(config.auth);
assistant
  .on('ready', () => {
    // start a conversation!
    //assistant.start(config.conversation);
  })
  .on('started', startConversation)
  .on('error', (error) => {
    console.log('Assistant Error:', error);
  });

module.exports = {
  config,
  startConversation,
  assistant,
};
