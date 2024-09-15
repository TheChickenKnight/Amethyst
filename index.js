//https://huggingface.co/TheBloke/neuronovo-7B-v0.3-GGUF
//https://www.npmjs.com/package/node-llama-cpp

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import mic from 'mic';
import { createWriteStream, writeFileSync, unlinkSync, readFileSync } from 'fs';
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

let micInstance;
let micInputStream;
let isRec = false;
let audioChunks;



var twirlTimer = (function() {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 250);
  })();

const startRec = () => {
    console.log("Listening...");
    twirlTimer.ref();
    if(micInstance) {
        micInstance.stop();
        micInputStream.unpipe();
    }
    micInstance = mic({
        rate: '48000',
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
    twirlTimer.unref();
    console.log("Done Listening!");
    if (!isRec)
        return;
    isRec = false;
    micInstance.stop();
    console.log("Writing audio to disk...");
    twirlTimer.ref();
    const filename = await saveAudio(audioChunks);
    twirlTimer.unref();
    console.log("Audio Saved!\nProcessing Audio...");
    let prompt = await STT(filename);
    console.log("Audio Processed!");
    [filename].forEach(unlinkSync);
    if (prompt) {
        console.log("You said:\n" + prompt + "\nGenerating response...");
        twirlTimer.ref();
        //let response = await SynRes(prompt);
        let response = "hello."
        twirlTimer.unref();
        console.log("Done! GPT wrote:\n" + response);
        console.log("Synthesizing and playing audio...");
        const filename = await TTS(response);
        await play(path.join(__dirname, filename));
        unlinkSync(filename);
        console.log("audio");
    } else
        console.log("No Text was found in audio.");
    console.log("---------------------------------------------------------------");
    startRec();
}

const saveAudio = async audioChunks => {
    let filename = await new Promise((resolve, reject) => {
        const wavWriter = new Writer({ sampleRate: 48000, channels: 1});
        const filename = "./audio/" + Date.now() + ".wav";
        wavWriter.pipe(createWriteStream(filename));
        wavWriter.on('finish', () => {
            console.log("Created " + filename);
            resolve(filename);
        });
        wavWriter.on('error', reject);
        wavWriter.end(Buffer.concat(audioChunks));
    });
    return filename;
};

const recognizer = sherpa_onnx.createOfflineRecognizer({
    modelConfig:{
        whisper: {
            encoder: './models/sherpa-onnx-whisper-tiny.en/tiny.en-encoder.int8.onnx',
            decoder: './models/sherpa-onnx-whisper-tiny.en/tiny.en-decoder.int8.onnx',
            language: '',
            task: 'transcribe',
            tailPaddings: -1,
        },
        tokens: './models/sherpa-onnx-whisper-tiny.en/tiny.en-tokens.txt',
    }
})
const stream = recognizer.createStream();

const STT = async filename => {
    const wave = sherpa_onnx.readWave(filename);
    stream.acceptWaveform(wave.sampleRate, wave.samples);
    recognizer.decode(stream);
    return await recognizer.getResult(stream).text;
}

const modelPath = path.join(__dirname, "models", "neuronovo-7b-v0.3.Q2_K.gguf");
const model = new LlamaModel({modelPath});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context, conversationHistory});

const SynRes = async prompt => {
    const response = await session.prompt(prompt);
    conversationHistory.push({ prompt, response });
    writeFileSync('history.json', JSON.stringify({ conversationHistory }, null, 2));
    return response;
};

function createOfflineTts() {
    let offlineTtsVitsModelConfig = {
      model: './models/vits-piper-en_US-amy-low/en_US-amy-low.onnx',
      tokens: './models/vits-piper-en_US-amy-low/tokens.txt',
      dataDir: './models/vits-piper-en_US-amy-low/espeak-ng-data',
      noiseScale: 0.667,
      noiseScaleW: 0.8,
      lengthScale: 1.0,
    };
    let offlineTtsModelConfig = {
      offlineTtsVitsModelConfig: offlineTtsVitsModelConfig,
      numThreads: 1,
      debug: 1,
      provider: 'cpu',
    };
  
    let offlineTtsConfig = {
      offlineTtsModelConfig: offlineTtsModelConfig,
      maxNumSentences: 1,
    };
  
    return sherpa_onnx.createOfflineTts(offlineTtsConfig);
  }
  

const TTS = async text => {
    const filename = './out/' + Date.now() + '.wav';
    const tts = createOfflineTts();
    const speakerId = 0;
    const speed = 1.0;
    const audio = tts.generate({
      text:
          '“Today as always, men fall into two groups: slaves and free men. Whoever does not have two-thirds of his day for himself, is a slave, whatever he may be: a statesman, a businessman, an official, or a scholar.”',
      sid: speakerId,
      speed: speed
    });
    
    tts.save(filename, audio);
    tts.free();
    return filename
};

const compressAudio = async (inputFile, outputFile) => {
    const result = ffmpeg(inputFile).audioFrequency(16000).save(outputFile);
    if (result) {
      console.log("Audio compressed successfully");
    }
  };

startRec();
process.stdin.resume();