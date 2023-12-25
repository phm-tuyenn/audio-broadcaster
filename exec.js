const { exec, execSync } = require("child_process")
const fs = require("fs")
const data = require("./data.json")
//run api
exec("cd api && npm start")
//run react
if (data.status === "development") {
    exec("cd client && npm start")
} else if (data.status === "production") {
    if (!data.built) {
        execSync("cd client && npm run build")
        data.built = true
        fs.writeFileSync("./data.json", JSON.stringify(data))
    }
    exec("cd client && npx serve -s build")
}