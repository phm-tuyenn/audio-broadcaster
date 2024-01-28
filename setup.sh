#!/bin/bash

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
