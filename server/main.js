import fs from "fs"
import path from "path"
import { Worker } from "worker_threads"
import http from "http"
import url from "url"

http.createServer(function (req, res) {
    const headers = {
        'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
    }

    if (['GET', 'POST'].indexOf(req.method) > -1) {
        res.writeHead(200, headers);
    }
    
    const reqUrl = url.parse(req.url).pathname
    if (reqUrl === "/") {
        res.write("hello")
        res.end()
    } else if (reqUrl === "/restart") {
        res.write("restart")
        res.end();
        process.exit(1);
    }
}).listen(8080); 

let config = JSON.parse(fs.readFileSync("../data/config.json", "utf8"))

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
fs.writeFileSync("../data/config.json", JSON.stringify(config))
config = JSON.parse(fs.readFileSync("../data/config.json", "utf8"))

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
