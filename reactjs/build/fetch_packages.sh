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
REACTJS_HOME="$WORKSPACE/reactjs"
echo "Reactjs home is $REACTJS_HOME"

echo "cd into  $REACTJS_HOME"
cd $REACTJS_HOME
echo 'npm install'
npm install
