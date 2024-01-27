import { parentPort } from "worker_threads"
import {execSync} from "child_process"
import { isInternetAvailable } from "is-internet-available"

function generateText(a) {
    console.log("start make text")
    execSync(`gtts "${a.id}" -l vi -o ${a.dir.toString()}/0.mp3`)
    console.log("make text ok")
}

function makeText(a) {
    isInternetAvailable().then((res) => {
        if (res) generateText(a)
        else {
            console.log("err")
            makeText(a)
        }
    })
}
parentPort.once("message", a => {
    makeText(a)
})
