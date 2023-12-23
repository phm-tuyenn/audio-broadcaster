import fs from "fs"
import path from "path"
import { parentPort } from "worker_threads"
import {execSync} from "child_process"
import { isInternetAvailable } from "is-internet-available"

async function getList(a) {
    let data
    await isInternetAvailable().then(function(res){
        if (res) {
            let output = execSync(`yt-dlp -j --flat-playlist ${a.id} --playlist-reverse`).toString()
            data = JSON.parse(`[${output.replace(/\n/g, ",").substr(0, output.length - 1)}]`)
        } else throw new Error()
    }).catch(async function(err){
        console.error(err)
        console.log(`get list -ing`)
        data = await getList(a)
    })
    return data
}

async function download(a, i, data) {
    let k
    let command = `yt-dlp -i --force-overwrites --extract-audio --audio-format mp3 -o "${path.join(a.dir.toString(), `${i.toString()}.mp3`)}" https://youtube.com/watch?v=${data[i].id}`
    await isInternetAvailable().then(function(res){
        if (res) {
            console.log(command)
            execSync(command)
            k = 0
        } else throw new Error()
    }).catch(async function(err){
        console.error(err)
        console.log("oops")
        k = await download(a, i, data)
    })
    return k
}

async function downloadP(a) {
    console.log(`get list`)
    let data = await getList(a)
    console.log(`get list ok`)
    console.log(`${fs.readdirSync(a.dir.toString()).length.toString()} to ${data.length.toString()}`)
    for(let index = fs.readdirSync(a.dir.toString()).length; index < data.length; index++) {
        console.log(`${index} download`)
        let k = await download(a, index, data)
        console.log(`${index} download ok ${k}`)
    }
}

parentPort.once("message", a => {
    downloadP(a)
})