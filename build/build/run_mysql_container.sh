#!/bin/bash
set -e -x
# rest of the script
#!/bin/bash
set -e -x
# rest of the script
echo 'Running Docker Container'
AGENT_INSTALL_DIR="/var/lib/go-agent/pipelines"
WORKSPACE="$AGENT_INSTALL_DIR/$GO_PIPELINE_NAME"
echo "workspace is $WORKSPACE"
DOCKER_HOME="$WORKSPACE/docker"
echo "Docker home is $DOCKER_HOME"
#docker -H localhost:2375 build --rm -t devopulence/mysql:sif $DOCKER_HOME

#docker -H localhost:2375 build --no-cache --rm --build-arg DATABASE_NAME=sif --build-arg ROOT_PW=jaclynmarie1 -t devopulence/mysql:sif $DOCKER_HOME
#The following is good before local storage
#docker -H localhost:2375 run -d -e TZ=America/New_York --name sif-mysql-container -p 3306:3306 devopulence/mysql:sif

#docker -H localhost:2375 ps -a --no-trunc --filter name=^/sif-mysql-container$ -q

#docker -H localhost:2375 run -d -e TZ=America/New_York --name sif-mysql-container -p 3306:3306 --volume=/storage/docker/mysql-datadir:/var/lib/mysql devopulence/mysql:sif

# working
# docker -H localhost:2375  run -d  -e TZ=America/New_York --name sif-mysql-container -p 3306:3306 -v /var/lib/sif-mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=jaclynmarie1 mysql

containers=$(docker -H localhost:2375 ps -a --no-trunc --filter name=^/sif-mysql-container$ -q)
if [[ $? != 0 ]]; then
    echo "Command failed."
    exit 1
elif [[ $containers ]]; then
    echo "We found containers do nothing"

else
    echo "No containers found start"
docker -H localhost:2375  run -d  -e TZ=America/New_York --name sif-mysql-container -p 3306:3306 -v /var/lib/sif-mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=jaclynmarie1 mysql

fi