#!/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source .bashrc
nvm install 20.9
sudo apt install --fix-broken -y
sudo apt install ffmpeg -y
sudo apt install mpg123 -y
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
