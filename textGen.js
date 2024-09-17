import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
import { writeFileSync, readFile, readFileSync } from 'fs';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

let conversationHistory = require('./history.json').conversationHistory;
const modelPath = path.join(__dirname, "models", "slime.gguf");
const model = new LlamaModel({modelPath});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context, conversationHistory});

setInterval(async () => {
    let prompts = readFileSync('./prompts.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
    if (prompts[0] == "")
        return;
    const prompt = prompts.shift();
    writeFileSync('./prompts.txt', prompts.join('\n'), null, 2);
    console.log(prompt);
    conversationHistory.push({
        prompt,
        response: await session.prompt(prompt)
    });
    writeFileSync('history.json', JSON.stringify({ conversationHistory }, null, 2));
}, 1000);