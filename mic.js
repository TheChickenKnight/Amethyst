import mic from 'mic';
import { Writer } from 'wav';
import { Writable } from 'stream';
import { Buffer } from 'buffer';
import { createWriteStream } from 'fs';

var micInstance;
var micInputStream;
var audioChunks;
var isRec = false;

const rec = () => {
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
    isRec = true;
    micInputStream.pipe(new Writable({
        write(chunk, _, callback) {
            if (isRec)
                audioChunks.push(chunk);
            callback();
        }
    }));
    micInputStream.on('silence', async () => {
        if (!isRec)
            return;
        isRec = false;
        micInstance.stop();
        await saveAudio(audioChunks);
        rec();
    });
    micInstance.start();
}

const saveAudio = async audioChunks => {
    if (audioChunks.length < 6)
        return;
    console.log("saving Audio");
    return new Promise((res, rej) => {
        const audioBuffer = Buffer.concat(audioChunks);
        const wavWriter = new Writer({ sampleRate: 48000, channels: 1});
        const filename = "in_" + Date.now() + '.wav';
        wavWriter.pipe(createWriteStream('./audio/' + filename));
        wavWriter.on('finish', () => {
            res(filename);
        });
        wavWriter.on('error', rej);
        wavWriter.end(audioBuffer);
    });
};

rec();