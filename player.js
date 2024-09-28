import pkg from 'sound-play';
const { play } = pkg;
import { join } from 'path';
import { unlink, readdirSync } from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const audio = () => {
    let files = readdirSync('./audio/out/');
    if (files.length == 0)
        return setTimeout(audio, 1000);
    play(join(__dirname, '/audio/out/',  files[0])).then(() => {
        unlink(join(__dirname, '/audio/out/' + files[0]), console.error);
        setTimeout(audio, 1000);
    });
}

audio();
process.stdin.resume();