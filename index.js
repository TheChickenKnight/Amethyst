//https://huggingface.co/TheBloke/neuronovo-7B-v0.3-GGUF
//https://www.npmjs.com/package/node-llama-cpp

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import mic from 'mic';
import { createWriteStream, writeFileSync, unlinkSync } from 'fs';
import sound from 'sound-play';
const gpt = require('gpti');
import { Writer } from 'wav';
import { Writable } from 'stream';
import Audio2TextJS from 'audio2textjs';
import WebSocket from 'ws';
global.WebSocket = WebSocket;
import { EdgeSpeechTTS } from '@lobehub/tts';
import { Buffer } from 'buffer';
import path from 'path';
import dotenv from 'dotenv';
const history = require('./history.json');
let messages = history.messages;
dotenv.config();
let micInstance;
let micInputStream;
let isRec = false;
let audioChunks;

const tts = new EdgeSpeechTTS({ locale: 'en-us' });

const converter = new Audio2TextJS({
    threads: 4,
    processors: 1,
    outputJson: true
});

const startRec = () => {
    console.log("Starting rec.");
    if(micInstance) {
        micInstance.stop();
        micInputStream.unpipe();
    }
    micInstance = mic({
        rate: '44100',
        channels: '1',
        debug: false,
        exitOnSilence: 10
    });
    micInputStream = micInstance.getAudioStream();
    audioChunks = [];
    isRec = true;
    micInputStream.pipe(new Writable({
        write(chunk, _, callback) {
            if (isRec)
                audioChunks.push(chunk);
            callback();
        }
    }));
    micInputStream.on('silence', handleSilence);
    micInstance.start();
};

const handleSilence = async () => {
    console.log("Silence!");
    if (!isRec)
        return;
    isRec = false;
    micInstance.stop();
    const filename = await saveAudio(audioChunks);
    await converter.runWhisper(filename, 'tiny.en', 'en');
    const output = require(filename + ".OUTPUT.wav.json");
    unlinkSync(path.join(__dirname, filename));
    unlinkSync(filename + ".OUTPUT.wav");
    unlinkSync(filename + ".OUTPUT.wav.json");
    let message = output.transcription[0].text;
    if (!message.includes("BLANK_AUDIO")) {
        console.log("You said: " + message);
        await gpt.gpt.v1({
            messages,
            prompt: message,
            model: "gpt-4",
            markdown: false
        }, async (err, data) => {
            if (err)
                return console.error(err);
            console.log("GPT wrote: \n" + data.gpt);
            console.log("audio time");
            messages = messages.concat([
                { role: "user", content: message },
                { role: "assistant", content: data.gpt }
            ]);
            writeFileSync('history.json', JSON.stringify({ messages }, null, 2));
            const filename = await resToAudio(data.gpt);
            await sound.play(path.join(__dirname, filename));
            unlinkSync(filename);
            console.log("audio time done");
        });
    }
    startRec();
}

const saveAudio = async audioChunks => {
    return await new Promise((resolve, reject) => {
        console.log("saving audio");
        const wavWriter = new Writer({ sampleRate: 48000, channels: 2});
        const filename = "./audio/" + Date.now() + ".wav";
        wavWriter.pipe(createWriteStream(filename));
        wavWriter.on('finish', () => resolve(filename));
        wavWriter.on('error', reject);
        wavWriter.end(Buffer.concat(audioChunks));
    });
}

const resToAudio = async input => {
    const filename = './out/' + Date.now() + '.mp3';
    writeFileSync(path.resolve(filename), Buffer.from(await (await tts.create({
        input,
        options: { voice: 'en-US-GuyNeural' }
    })).arrayBuffer()));
    return filename;
};

startRec();
process.stdin.resume();