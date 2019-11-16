echo -e "\e[48;5;10m[i]\e[48;5;0m Installing/Updating NodeJS, npm and ffmpeg"
apt-get update>ilog.txt
apt-get install npm>>ilog.txt
apt-get install nodejs>>ilog.txt
apt-get install ffmpeg>>ilog.txt
echo -e "\e[48;5;10m[i]\e[48;5;0m Installing/Updating libraries"
npm install n>>ilog.txt
npm install -g npm>>ilog.txt
npm install discord.js>>ilog.txt
npm install express>>ilog.txt
npm install node-opus>>ilog.txt
npm install ytdl-core>>ilog.txt
echo -e "\e[48;5;10m[i]\e[48;5;0m Searching for updates"
git pull https://github.com/tudbut/bottyclient.git>>ilog.txt
echo -e "\e[48;5;10m[i]\e[48;5;0m All libraries should be installed now"
echo -e "\e[48;5;10m[i]\e[48;5;0m Starting!"
node server.js
