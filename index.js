import mic from 'mic';
import fs, { createWriteStream } from 'fs';
import sound from 'sound-play';
import { gpt } from 'gpti';
import { Writer } from 'wav';
import { Writable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();

