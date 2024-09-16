import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import mic from 'mic';
import { createWriteStream, writeFileSync, unlinkSync } from 'fs';
import pkg from 'sound-play';
const { play } = pkg;
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
import { Writer } from 'wav';
import { Writable } from 'stream';
import { Buffer } from 'buffer';
import path from 'path';
import sherpa_onnx from 'sherpa-onnx';

import dotenv from 'dotenv';
dotenv.config();

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

import WebSocket from 'ws';
global.WebSocket = WebSocket;

const history = require('./history.json');
let conversationHistory = history.conversationHistory;



const tts = sherpa_onnx.createOfflineTts({
    offlineTtsModelConfig: {
        offlineTtsVitsModelConfig: {
            model: './models/vits-piper-en_US-amy-low/en_US-amy-low.onnx',
            tokens: './models/vits-piper-en_US-amy-low/tokens.txt',
            dataDir: './models/vits-piper-en_US-amy-low/espeak-ng-data',
            noiseScale: 0.667,
            noiseScaleW: 0.8,
            lengthScale: 1.0,
          },
        numThreads: 1,
        debug: 1,
        provider: 'cpu',
      },
    maxNumSentences: 1,
  });

const TTS = async text => {
    const filename = './out/' + Date.now() + '.wav';
    const audio = tts.generate({
      text,
      sid: 0,
      speed: 1
    });
    
    tts.save(filename, audio);
    return filename;
};


const recognizer = sherpa_onnx.createOfflineRecognizer({
    modelConfig:{
        whisper: {
            encoder: './models/sherpa-onnx-whisper-tiny.en/tiny.en-encoder.int8.onnx',
            decoder: './models/sherpa-onnx-whisper-tiny.en/tiny.en-decoder.int8.onnx',
            language: 'en',
            task: 'transcribe',
            tailPaddings: -1,
        },
        tokens: './models/sherpa-onnx-whisper-tiny.en/tiny.en-tokens.txt',
    }
})
const stream = recognizer.createStream();
const STT = async filename => {
    const wave = sherpa_onnx.readWave('./audio/' + filename);
    stream.acceptWaveform(wave.sampleRate, wave.samples);
    recognizer.decode(stream);
    const res = await recognizer.getResult(stream);
    return res.text;
}

const saveAudio = async audioChunks => {
    return new Promise((res, rej) => {
        const audioBuffer = Buffer.concat(audioChunks);
        const wavWriter = new Writer({ sampleRate: 48000, channels: 1});
        const filename = Date.now() + '.wav';
        wavWriter.pipe(createWriteStream('./audio/' + filename));
        wavWriter.on('finish', () => {
            res(filename);
        });
        wavWriter.on('error', rej);
        wavWriter.end(audioBuffer);
    });
}

    

const modelPath = path.join(__dirname, "models", "tinyllama.gguf");
const model = new LlamaModel({modelPath});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context, conversationHistory});

let micInstance = mic({
    rate: '24000',
    channels: '1',
    debug: true,
    exitOnSilence: 5
});
let micInputStream = micInstance.getAudioStream();
let audioChunks = [];
micInputStream.pipe(new Writable({
    write(chunk, _, callback) {
        //if (isRecording)
            audioChunks.push(chunk);
        callback();
    }
}));
micInputStream.on('silence', async () => {
    micInstance.stop();
    if (audioChunks.length <= 6)
        return;
    const filename = await saveAudio(audioChunks);
    setTimeout(async () => {
        const prompt = await STT(filename);
        unlinkSync('./audio/' + filename);
        console.log("You said: " + prompt);
        console.log("length: " + audioChunks.length)
        if (!prompt.includes('[')) {
            const response = await session.prompt(prompt);
            conversationHistory.push({ prompt, response });
            writeFileSync('history.json', JSON.stringify({ conversationHistory }, null, 2));
            const filename = await TTS(response);
            await play(path.join(__dirname, filename));
            unlinkSync(filename); 
        } else
            console.log("No Text was found in audio.");
        console.log("---------------------------------------------------------------");
    }, 10);
});
micInstance.start();



