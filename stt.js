import { readdirSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import sherpa_onnx from 'sherpa-onnx';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

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
const STT = async filename => {
    const wave = sherpa_onnx.readWave('./audio/' + filename);
    const stream = recognizer.createStream();
    stream.acceptWaveform(wave.sampleRate, wave.samples);
    recognizer.decode(stream);
    const res = await recognizer.getResult(stream);
    return res.text;
}

const history = require('./history.json')
let conversationHistory = history.conversationHistory;
const modelPath = path.join(__dirname, "models", "hamster.gguf");
const model = new LlamaModel({modelPath});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context, conversationHistory});

var isRunning = false;

const textGen = async () => {
    if (isRunning)
        return setTimeout(textGen, 1000);
    let files = readdirSync('./audio/');
    if (files.length == 0)
        return setTimeout(textGen, 1000);
    let text = await STT(files[0]);
    unlinkSync('./audio/' + files[0]);
    if (text.includes('['))
        return setTimeout(textGen, 1000);
    isRunning = true;
    session.prompt(text).then(async response => {
        console.log(text, response);
        conversationHistory.push({
            prompt: text,
            response
        });
        writeFileSync('history.json', JSON.stringify({ conversationHistory }, null, 2));
        isRunning = false;
        await textGen();
    });
};

textGen();
process.stdin.resume();