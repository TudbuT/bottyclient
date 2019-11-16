echo off
cls
echo [i] Updating BC
git pull https://github.com/TudbuT/bottyclient.git windows > log.txt
echo [i] Starting
node server.js
pause
