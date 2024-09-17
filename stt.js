import { readdirSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import sherpa_onnx from 'sherpa-onnx';

let prompts = [];

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

setInterval(async () => {
    let files = readdirSync('./audio/');
    if (files.length == 0)
        return;
    let text = await STT(files[0]);
    unlinkSync('./audio/' + files[0]);
    if (text.includes('['))
        return;
    prompts = readFileSync('./prompts.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
    if (prompts[0] == "")
        prompts = [];
    prompts.push(text);
    writeFileSync('prompts.txt', prompts.join('\n'), null, 2);
    console.log(prompts);
}, 1000);