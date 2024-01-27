#!/bin/bash
curl -sL https://deb.nodesource.com/setup_20.x | bash -
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
