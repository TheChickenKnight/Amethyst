import { readdirSync, writeFileSync, unlink } from 'fs';
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
    const wave = sherpa_onnx.readWave('./audio/in/' + filename);
    const stream = recognizer.createStream();
    stream.acceptWaveform(wave.sampleRate, wave.samples);
    recognizer.decode(stream);
    const res = await recognizer.getResult(stream);
    return res.text;
}

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

const history = require('./history.json')
let conversationHistory = history.conversationHistory;
const modelPath = path.join(__dirname, "models", "slime.gguf");
const model = new LlamaModel({modelPath});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context, conversationHistory});

var isRunning = false;

const textGen = async () => {
    if (isRunning)
        return setTimeout(textGen, 1000);
    let files = readdirSync('./audio/in/');
    if (files.length == 0)
        return setTimeout(textGen, 1000);
    let text = await STT(files[0]);
    await unlink('./audio/in/' + files[0], console.error);
    if (text.includes('['))
        return setTimeout(textGen, 1000);
    isRunning = true;
    session.prompt(text).then(async response => {
        conversationHistory.push({
            prompt: text,
            response
        });
        writeFileSync('history.json', JSON.stringify({ conversationHistory }, null, 2));
        const audio = tts.generate({
            text: response,
            sid: 0,
            speed: 1
        });
        const filename = './audio/out/' + Date.now() + '.wav';
        tts.save(filename, audio);
        isRunning = false;
        await textGen();
    });
};

textGen();
process.stdin.resume();