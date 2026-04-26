import { join } from 'path';
import { unlink, readdirSync } from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'child_process';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const playAudioFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const command = `ffplay -nodisp -autoexit -loglevel quiet "${filePath}"`;
        
        console.log(`Playing: ${filePath.split('\\').pop()}`);
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('FFplay error:', error.message);
                reject(error);
            } else 
                resolve();
        });
    });
};

const audio = () => {
    let files = readdirSync('./audio/out/');
    if (files.length == 0)
        return setTimeout(audio, 1000);
    
    const filePath = join(__dirname, '/audio/out/', files[0]);
    playAudioFile(filePath).then(() => {
        unlink(join(__dirname, '/audio/out/' + files[0]), console.error);
        setTimeout(audio, 1000);
    }).catch(console.error);
}

audio();
// Uncomment the line below to see available audio devices
// listAudioDevices();
process.stdin.resume();