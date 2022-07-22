cd ~/pixelflux/
forever start -l ~/pixelflux/out.log -o ~/pixelflux/out.log -e ~/pixelflux/out.log --uid "pixelflux" server.js
echo "Pixelflux Started"

