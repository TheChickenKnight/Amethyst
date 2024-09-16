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

let micInstance;
let micInputStream;
let isRecording = false;
let audioChunks = [];

const startRec = () => {
    if (micInstance) {
        micInstance.stop();
        micInputStream.unpipe();
    }
    micInstance = mic({
        rate: '24000',
        channels: '1',
        debug: true,
        exitOnSilence: 5
    });
    micInputStream = micInstance.getAudioStream();
    audioChunks = [];
    isRecording = true;
    micInputStream.pipe(new Writable({
        write(chunk, _, callback) {
            if (isRecording)
                audioChunks.push(chunk);
            callback();
        }
    }));
    micInputStream.on('silence', handleSilence);
    micInstance.start();
}

const handleSilence = async () => {
    console.log("Done Listening!");
    if (!isRecording)
        return;
    isRecording = false;
    micInstance.stop();
    console.log("Writing audio to disk...");
    const filename = await saveAudio(audioChunks);
    console.log("Audio Saved!\nProcessing Audio...");
    setTimeout(async () => {
        let prompt = await STT(filename);
        unlinkSync('./audio/' + filename);
        console.log("Audio Processed!");
        console.log("You said:\n" + prompt + "\nGenerating response...");
        if (!prompt.includes('[')) {
            let response = await SynRes(prompt);
            console.log("Done! GPT wrote:\n" + response);
            console.log("Synthesizing and playing audio...");
            const filename = await TTS(response);
            await play(path.join(__dirname, filename));
            unlinkSync(filename);
        } else
            console.log("No Text was found in audio.");
        console.log("---------------------------------------------------------------");
        startRec();
    }, 10);
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

const modelPath = path.join(__dirname, "models", "llama-2-tiny-random.gguf");
const model = new LlamaModel({modelPath, gpuLayers: 30});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context, conversationHistory});

const SynRes = async prompt => {
    const response = await session.prompt(prompt);
    conversationHistory.push({ prompt, response });
    writeFileSync('history.json', JSON.stringify({ conversationHistory }, null, 2));
    return response;
};

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

startRec();
process.stdin.resume();