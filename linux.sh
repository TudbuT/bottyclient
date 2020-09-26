echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Installing/Updating NodeJS, npm and ffmpeg"
yes Y | apt-get update>ilog.txt 2>&1
yes Y | apt-get install npm>>ilog.txt 2>&1
yes Y | apt-get install nodejs-legacy>>ilog.txt 2>&1
yes Y | apt-get install ffmpeg>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Installing/Updating libraries"
npm i>>ilog.txt 2>&1
n latest>>ilog.txt 2>&1
npm install -g npm>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Searching for updates"
git config user.email "x@y.z"
git config user.name "XYZ"
git pull https://github.com/tudbut/bottyclient.git>>ilog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m All libraries should be installed now"
echo "cd ${PWD} && bash run.sh">/bin/bcl && chmod a+rx /bin/bcl
#echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Starting!"
#node server.js
