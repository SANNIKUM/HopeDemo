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


echo 'bundle install'
bundle install

echo "DHS ENV = $DHS_ENV"


echo 'copy database.yml'

yes | cp -rf $WORKSPACE/config/database.yml $WORKSPACE/config/database.back.yml

echo 'configure database.yml'
ruby build/database.rb $WORKSPACE
