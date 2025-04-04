npm init -y  
npm install express mongoose dotenv cors nodemon node-cron
npm i body-parser http https fs



# In server to start the node js

# Type 1

screen -S linkmanagement
screen -X -S 27131.linkmanagement quit
node server.js
ctrl-A  and then D - detach the screen session

screen -ls


# Type 2

pm2 start server.js --name node 

<!-- to save -->
pm2 save

// to check log
pm2 logs node

# Cron Job

cron job  ---> dbsizemonitor

pm2 start config/monitorDbSize.js --name "db-monitor" 
pm2 save
pm2 logs db-monitor
