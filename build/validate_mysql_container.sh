#!/bin/bash
set -e -x
# rest of the script
#!/bin/bash
set -e -x
# rest of the script
echo 'Validating Docker Container'
AGENT_INSTALL_DIR="/var/lib/go-agent/pipelines"
WORKSPACE="$AGENT_INSTALL_DIR/$GO_PIPELINE_NAME"
echo "workspace is $WORKSPACE"
DOCKER_HOME="$WORKSPACE/docker"
echo "Docker home is $DOCKER_HOME"
#docker -H localhost:2375 build --rm -t devopulence/mysql:sif $DOCKER_HOME


echo "sleeping for 10 seconds"
sleep 10
echo "validating mysql container is ready"

if mysql -h 127.0.0.1 -u root -pjaclynmarie1 -e "show databases" | grep 'sif_development'; then
  echo "matched"
  exit 0
else
  echo "no match"
  exit 1
fi