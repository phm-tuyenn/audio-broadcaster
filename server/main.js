import fs from "fs"
import path from "path"
import { Worker } from "worker_threads"

let config = JSON.parse(fs.readFileSync("../client/src/config.json", "utf8"))

function countFolder() {
    let count = 0
    fs.readdirSync(".").forEach(item => {
        if (/^\d+$/.test(item) && fs.lstatSync(item).isDirectory()) count++
    })
    return count
}

for(let i = 1; i <= config.length; i++) {
    if (!config[i - 1].dir) {
        fs.mkdirSync((countFolder() + 1).toString())
        config[i - 1].dir = countFolder()
    }
}
fs.writeFileSync("../client/src/config.json", JSON.stringify(config))
config = JSON.parse(fs.readFileSync("../client/src/config.json", "utf8"))

function fileFilter(startPath, filter) {
    let files = fs.readdirSync(startPath)
    for (let i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i])
        if (filename.endsWith(filter)) {
            if (filter == ".webm" && fs.existsSync(filename.replace(".webm", ".mp3"))) {
                fs.unlinkSync(filename.replace(".webm", ".mp3"))
            }
            fs.unlinkSync(filename)
        }
    }
}

for (let i = 0; i < config.length; i++) {
    let Path = (i + 1).toString()
    fileFilter(Path, '.webm')
    fileFilter(Path, '.part')
    fileFilter(Path, '.ytdl')
    if (config[i].type === "text" && fs.readdirSync(Path).length > 2) {
        let files = fs.readdirSync(Path)
        for (let i = 0; i < files.length; i++) {
            fs.unlinkSync(path.join(Path, files[i]))
        }
    }
}
console.log("filter and config ok")

function thread(path, config) {
    let work = new Worker(path)
    if (config.data) work.postMessage(config.data)
    work.on("exit", () => {
        if (config.again) {
            console.log(`again ${path}`)
            if (config.data) thread(path, config)
            else thread(path)
        }
    })
}
thread('./play.js', { again: false });

async function generateProcess(i) {
    if (config[i].type === "text") {
        console.log(`${i} make text`)
        thread("./text.js", { data: config[i], again: false })
    } else if (config[i].type === "link") {
        console.log(`${i} download`)
        thread("./download.js", { data: config[i], again: true })
    }

}

for(let i = 0; i < config.length; i++) {
    console.log(`process ${i} spawned`)
    generateProcess(i)
}
