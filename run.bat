echo off
cls
echo [i] Updating BC
git pull https://github.com/TudbuT/bottyclient.git windows
echo [i] Starting
node server.js
