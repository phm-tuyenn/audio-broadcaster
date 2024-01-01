import fs from "fs"
import path from "path"
import { Worker } from "worker_threads"

let source = JSON.parse(fs.readFileSync("../data/source.json", "utf8"))

function countFolder() {
    let count = 0
    fs.readdirSync(".").forEach(item => {
        if (/^\d+$/.test(item) && fs.lstatSync(item).isDirectory()) count++
    })
    return count
}

for(let i = 0; i < source.length; i++) {
    if (!source[i].dir) {
        fs.mkdirSync((countFolder() + 1).toString())
        source[i].dir = countFolder()
    }
}
fs.writeFileSync("../data/source.json", JSON.stringify(source))
source = JSON.parse(fs.readFileSync("../data/source.json", "utf8"))

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

for (let i = 0; i < source.length; i++) {
    let Path = (i + 1).toString()
    fileFilter(Path, '.webm')
    fileFilter(Path, '.part')
    fileFilter(Path, '.ytdl')
    if (source[i].type === "text" && fs.readdirSync(Path).length > 2) {
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
    if (source[i].type === "text") {
        console.log(`${i} make text`)
        thread("./text.js", { data: source[i], again: false })
    } else if (source[i].type === "link") {
        console.log(`${i} download`)
        thread("./download.js", { data: source[i], again: true })
    }

}

for(let i = 0; i < source.length; i++) {
    console.log(`process ${i} spawned`)
    generateProcess(i)
}
