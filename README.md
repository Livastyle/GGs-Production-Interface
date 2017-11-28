# GGs-Production-Interface

This is the overlay and stream controlling software developed and used by Liva at GeekyGoonSquad.

IMPORTANT: IT HAS BUGS. NOT TERRIBLE ONES, BUT USE AND TEST IT ON YOUR OWN. SOME FEATURES MAY NOT WORK PROPERLY OR PERHABS NOT AT ALL!

This software was developed with the intention to run on a server. One main goal was Multiclient support, meaning that multiple operators could open the software and work on stream simultanously. (such as 1 dedicated person for database, another one for thumbnails, another one for stream operation).

I was using a Raspberry Pi 3 as a server.

# Installation
This software requires 3 things to be set up:
 - HTTP (for the interface)
 - MySQL (for the database)
 - node.js (for transmitting)
 
HTTP: setup an Apache or nginx server, whatever you like. Move all files into your root (sub-directorys may also work, never tested)
MySQL: create a database and import the "mysql.sql" database

Now, go into /cp/config.php and add the MySQL login data

node.js: go into /node/ and execute the server.js
 - windows: use the node.exe 
 - linux: install node and execute. I HIGHLY RECOMMEND USING PM2 in Deamon mode!!!
 
 thats it, now open your web browser and navigate to http://[address]/cp/ to open the control panel
 the overlays can be found in /overlays/[type].php
 
# Overlay usage Example

To open the scoreboard overlay, navigate to /overlays/scoreboard.php
it'll include all required files for the scoreboard from the /themes/[theme name]/ folder

for all other overlays, simply use /overlays/generic.php?sub=[overlay name]
now, it'll look for /themes/[theme name]/[overlay name].(js|css|html)

once you understand this system, it's fairly easy to use
