BASH=/bin/bash
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Updating BC"
git pull -s recursive https://github.com/TudbuT/bottyclient.git > rlog.txt 2>&1
echo -e "\e[48;5;10m\e[38;5;0m[i]\e[0m Starting"
js server.js
