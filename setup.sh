#!/bin/bash
apt install gnupg ca-certificates -y
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
apt update
apt install nodejs -y
apt install ffmpeg -y
apt install mpg123 -y
npm install --global kill-port
npm install --global gtts
git clone https://github.com/phm-tuyenn/audio-broadcaster
cd audio-broadcaster/
npm install --prefix api
npm install --prefix client
npm install --prefix control
touch data/config.json
echo [] > data/config.json
npm install --prefix server
cd server
chmod +x ./yt-dlp
cd ~
echo >> .bashrc
echo "cd audio-broadcaster" >> .bashrc
echo "mpg123 data/sound.mp3" >> .bashrc
echo "sleep 10" >> .bashrc
echo "sudo kill-port 3000 8080 9000" >> .bashrc
echo "mpg123 data/sound.mp3" >> .bashrc
echo "sudo npm run development-full" >> .bashrc
