echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Installing/Updating NodeJS, npm and ffmpeg"
yes Y | apt-get update>ilog.txt 2>&1
yes Y | apt-get install npm>>ilog.txt 2>&1
yes Y | apt-get install nodejs>>ilog.txt 2>&1
yes Y | apt-get install ffmpeg>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Installing/Updating libraries"
npm install n>>ilog.txt 2>&1
npm install -g npm>>ilog.txt 2>&1
npm install discord.js>>ilog.txt 2>&1
npm install express>>ilog.txt 2>&1
npm install node-opus>>ilog.txt 2>&1
npm install ytdl-core>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Searching for updates"
git config user.email "x@y.z"
git config user.name "XYZ"
git pull https://github.com/tudbut/bottyclient.git>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m All libraries should be installed now"
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Creating terminal command 'bottyclient' (this requires administrator)"
sudo echo `cd ${PWD}`>/bin/bottyclient
sudo echo `bash run.sh`>>/bin/bottyclient
sudo chmod +x /bin/bottyclient
echo `cd ${PWD}`>~/nbottyclient
echo `bash run.sh`>~/nbottyclient
chmod +x ~/nbottyclient
echo `alias nbottyclient="~/nbottyclient"`>>~/.bash_profile
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Starting!"
node server.js
