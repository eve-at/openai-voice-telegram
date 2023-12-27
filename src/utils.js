import { unlink } from "fs/promises"

import * as fs from 'fs';
import * as util from 'util';
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');

function getDateTime() {
    const d = new Date(); 
    return d.getFullYear() + "-"  
        + ('0' + d.getMonth()+1).slice(-2)  + "-" 
        + ('0' + d.getDate()).slice(-2) + " "
        + ('0' + d.getHours()).slice(-2) + ":"  
        + ('0' + d.getMinutes()).slice(-2) + ":" 
        + ('0' + d.getSeconds()).slice(-2) + " ";
}

export function log(message) { //
    //output.write(getDateTime() + util.format(message) + '\n');
    fs.appendFileSync('./stdout.log', getDateTime() + util.format(message) + '\n');
};

export function logError(message) { //
    //errorOutput.write(getDateTime() + util.format(message) + '\n');
    fs.appendFileSync('./stderr.log', getDateTime() + util.format(message) + '\n');
};

export async function removeFile(path) {
    try {
        await unlink(path)
    } catch (e) {
        console.log('Error while removing a voice file ', e.message)
    }
}