#!/bin/bash
curl -sL https://deb.nodesource.com/setup_20.x | bash -
apt update
apt install nodejs
npm install --global kill-port
npm install --global gtts
git clone https://github.com/phm-tuyenn/audio-broadcaster
cd audio-broadcaster/
npm install --prefix api
npm install --prefix client
npm install --prefix server
cd ~
echo >> .bashrc
echo "cd audio-broadcaster" >> .bashrc
echo "sleep 10" >> .bashrc
echo "kill-port 3000 8080 9000" >> .bashrc
echo "npm run development-full" >> .bashrc