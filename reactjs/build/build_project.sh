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
echo "DHS_DB_HOST_NAME = $DHS_DB_HOST_NAME"
echo "FQDN = $FQDN"

echo 'copy Master.jsx'
#cp app/components/Master.jsx app/components/master.jsx
cp $REACTJS_HOME/app/pages/shared/Master.jsx $REACTJS_HOME/app/pages/shared/master.jsx

echo "DHS_ENV = $DHS_ENV"
echo  "SSL_ENABLED = $SSL_ENABLED"
if [ $DHS_ENV = "development" ] || [ $DHS_ENV = "production" ]; then

   sed -i -e "s/qcdev.dhsportal.nyc/$FQDN/g" $REACTJS_HOME/app/common/app-settings/constants.jsx
   sed -i -e "s/qcdev.dhsportal.nyc/$FQDN/g" $REACTJS_HOME/app/common/app-settings/constants.jsx
  if [ $SSL_ENABLED = "true" ]; then
    echo "ssl is enabled"
   #sed -i -e 's/http/https/g' app/common/app-settings/constants.jsx
   sed -i -e 's/https/http/g' $REACTJS_HOME/index.html
   sed -i -e 's/http/https/g' $REACTJS_HOME/index.html
 else

   if [ $CUSTOMER = "SFDHS" ]; then
     echo "customer is SFDHS - ensure non ssl"
   sed -i -e 's/https/http/g' $REACTJS_HOME/app/common/app-settings/constants.jsx
   fi

  fi

else
  echo "non development"
fi

echo "cd into $REACTJS_HOME"
cd $REACTJS_HOME

echo 'npm run build'
npm run build


#cp /var/www/qc-all-sectors-fall.geojson dist/qc-all-sectors-fall.geojson
