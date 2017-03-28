#!/bin/bash
set -e -x
# rest of the script
#!/bin/bash
set -e -x
# rest of the script
echo 'Building DHS Project'
AGENT_INSTALL_DIR="/var/lib/go-agent/pipelines"
WORKSPACE="$AGENT_INSTALL_DIR/$GO_PIPELINE_NAME"
echo "workspace is $WORKSPACE"
DOCKER_HOME="$WORKSPACE/docker"
echo "Docker home is $DOCKER_HOME"

sudo sed -i -e 's/ruby \"2.3.1\"/#ruby \"2.3.1\"/g' Gemfile
echo 'bundle install'
bundle install




#echo 'copy database.yml'

#yes | cp -rf $WORKSPACE/config/database.yml $WORKSPACE/config/database.back.yml

echo 'configure database.yml'
echo "DHS_DB_HOST_NAME = $DHS_DB_HOST_NAME"
ruby build/database.rb $WORKSPACE $DHS_DB_HOST_NAME
