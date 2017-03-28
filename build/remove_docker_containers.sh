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
echo "Docker home is $DOCKER_HOME"

echo 'remove all docker containers'


containers=$(docker -H localhost:2375 ps -a -q)
if [[ $? != 0 ]]; then
    echo "Command failed."
    exit 1
elif [[ $containers ]]; then
    echo "We found containers to remove"
    docker -H localhost:2375 rm $(docker -H localhost:2375 ps -a -q)
else
    echo "No containers found remove"
fi


