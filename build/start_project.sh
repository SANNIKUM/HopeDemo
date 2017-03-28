#!/bin/bash
set -e -x
# rest of the script
#!/bin/bash
set -e -x
# rest of the script
echo 'Building SIF Project'
AGENT_INSTALL_DIR="/var/lib/go-agent/pipelines"
WORKSPACE="$AGENT_INSTALL_DIR/$GO_PIPELINE_NAME"
echo "workspace is $WORKSPACE"
DOCKER_HOME="$WORKSPACE/docker"



echo ' run mysql container'


echo ' validate mysql container'





echo 'starting rails'
#rails server -d
rails s -d -b 0.0.0.0 -p 3010

echo 'in future - build rails container'
#docker -H localhost:2375 build -t sif-app-image .

echo 'start -rails container'
#docker -H localhost:2375 run -d --name sif-container  -p 3000:3000 sif-app-image

echo 'rake seeds'
#rake db:drop db:create db:schema:load db:seed_fu
#rake db:migrate
# echo 'get new db migrations'
# rake db:migrate

echo 'update crontab'
#whenever --update-crontab


echo 'replacing production with development'
#sudo sed -i -e 's/production/development/g' /var/spool/cron/go
#in here is where we should add something to edit /var/spool/cron/go to change "-e production" to "-e development"
