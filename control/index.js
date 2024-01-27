const waitPort = require('wait-port');
const { exec } = require("child_process")

waitPort({ host: 'localhost', port: 3000 })
.then(({ open, ipVersion }) => {
    if (open) console.log(`The port 3000 is now open on IPv${ipVersion}!\n`);
    else console.log('The port 3000 did not open before the timeout...\n');
    exec("mpg123 ../data/sound.mp3")
})
.catch((err) => {
    console.err(`An unknown error occured while waiting for the port 3000: ${err}\n`);
});

waitPort({ host: 'localhost', port: 8080 })
.then(({ open, ipVersion }) => {
    if (open) console.log(`The port 8080 is now open on IPv${ipVersion}!\n`);
    else console.log('The port 8080 did not open before the timeout...\n');
    exec("mpg123 ../data/sound.mp3")
})
.catch((err) => {
    console.err(`An unknown error occured while waiting for the port 8080: ${err}\n`);
});

waitPort({ host: 'localhost', port: 9000 })
.then(({ open, ipVersion }) => {
    if (open) console.log(`The port 9000 is now open on IPv${ipVersion}!\n`);
    else console.log('The port 9000 did not open before the timeout...\n');
    exec("mpg123 ../data/sound.mp3")
})
.catch((err) => {
    console.err(`An unknown error occured while waiting for the port 9000: ${err}\n`);
});