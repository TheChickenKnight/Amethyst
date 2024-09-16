import path from 'path';
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const modelPath = path.join(__dirname, "models", "unholy-v2-13b.Q2_K.gguf");
const model = new LlamaModel({modelPath});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context});

session.prompt("hello").then(console.log)