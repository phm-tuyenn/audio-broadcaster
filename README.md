# audio-broadcaster
This is the program that make your Orange Pi (or RPi, BPi, etc) play scheduled audio which is text (Google Translate's voice) or YouTube playlist.

[Installation](#installation) | 
[Usage](#usage)
# Installation
Power on your Pi, wait for boot, SSH or connect monitor to it and start command:
```
sudo apt update             
sudo apt upgrade
sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install nodejs -y
sudo apt install curl # Run this if you don't have curl, which is installed on Pi by default
curl https://raw.githubusercontent.com/phm-tuyenn/audio-broadcaster/main/setup.sh -O
bash setup.sh
```
Then, the setup will automatically install for you. 

Then, change `.bashrc` to make program run on startup: Run `sudo nano .bashrc` and add these lines to the bottom of the file:
```
cd audio-broadcaster
mpg123 data/sound.mp3
sleep 10
sudo kill-port 3000 8080 9000
sudo pkill -f node
mpg123 data/sound.mp3
sudo npm run development-full
```
Then save it: <kbd>CTRL</kbd> + <kbd>O</kbd> => <kbd>Enter</kbd> => <kbd>CTRL</kbd> + <kbd>X</kbd>

After setup `.bashrc`, change some settings to make sure the program work properly:

Open visudo: `sudo visudo`

Navigate to the last line and add this line: `$USER ALL=(ALL) NOPASSWD: ALL` which `%USER` is your username (`whoami` output)

Then save it: <kbd>CTRL</kbd> + <kbd>O</kbd> => <kbd>Enter</kbd> => <kbd>CTRL</kbd> + <kbd>X</kbd>

Finally, reboot: `sudo reboot`
# Usage
The program will run automatically on startup.

Connect to the same network with Pi and open [http://pi.local:3000](http://pi.local:3000) in the browser.

Recommend to use an UPS in case of power cut to prevent the SD card from being damaged.

Stay have fun.

<sub><sup> From [@phm-tuyenn](https://github.com/phm-tuyenn) with ❤️</sup></sub>
