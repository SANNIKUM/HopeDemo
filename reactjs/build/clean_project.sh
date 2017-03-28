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
echo "Go Environment Name $GO_ENVIRONMENT_NAME"
echo "Go Pipeline Name $GO_PIPELINE_NAME"
echo "Go Pipeline Count $GO_PIPELINE_COUNTER"
echo "Go Pipeline Lable $GO_PIPELINE_LABEL"
echo "Go Revision $GO_REVISION"


echo 'remove dist subdirectory'
rm -f -R $REACTJS_HOME/dist/

echo 'remove dist subdirectory'
rm -f -R $REACTJS_HOME/node_modules/
