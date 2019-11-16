echo -e "\e[48;5;10m[i]\e[48;5;0m Installing/Updating NodeJS, npm and ffmpeg"
apt-get update > /dev/null
apt-get install npm > /dev/null
apt-get install nodejs > /dev/null
apt-get install ffmpeg > /dev/null
pkg install npm > /dev/null
pkg install nodejs > /dev/null
pkg install ffmpeg > /dev/null
echo -e "\e[48;5;10m[i]\e[48;5;0m Installing/Updating libraries"
npm install n > /dev/null
npm install discord.js > /dev/null
npm install express > /dev/null
npm install opusscript > /dev/null
npm install ytdl-core > /dev/null
echo -e "\e[48;5;10m[i]\e[48;5;0m Searching for updates"
git pull https://github.com/tudbut/bottyclient.git > /dev/null
echo -e "\e[48;5;10m[i]\e[48;5;0m All libraries should be installed now"
echo -e "\e[48;5;10m[i]\e[48;5;0m Starting!"
node server.js
