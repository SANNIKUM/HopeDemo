import React from "react";
import ReactDOM from 'react-dom';
import Modal from 'tg-modal';
import { connect } from 'react-redux';

import { sharedActionTypes } from "../../actions/sharedActionTypes";
import * as Action from "../../actions/action";
import { Constants } from "../../../../common/app-settings/constants"
import { Utility } from "../../../../common/utility"
import { CommonService }  from '../../services/common.service';
import { RoutesOnMapPopupService } from "../../services/route-on-map.service";

class RoutesOnMapPopup extends React.Component {

  /**
   * Constructor to initialize fields.
   */
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
     RoutesOnMapPopupService.initRouteMap(()=> 
    { 
      if(this.props.model.routesOnMap.routeObject)
        RoutesOnMapPopupService.showLayers(this.props.model.routesOnMap.routeObject,this.props.model.filterRoutesStatuses);
      this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { popupLoaderShown: false, isOpened:true }));
    });
  }  
  // on popup close handler
  onClose(){
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { popupLoaderShown: false, isOpened:false }));
   }
  /**
   * Render view.
   */
  render() {
   let route = this.props.model.routesOnMap.routeObject;
    return (
      <div className="container route-on-map-popup">
        <Modal isOpen={this.props.isOpen} autoWrap title={"Route : "+ (route.routeName)} isStatic={this.props.loader} onCancel={(e) => this.onClose()} >
            {this.props.loader ? <div className="model-loader"><span className="spinner"></span></div> : ''}
            <span className="site-borough-route"><b>Site: </b>{route.siteName} </span>
            <div id="routeOnMapBody"></div>
            <div className="footer-bar">
              <button className="button pull-right"  onClick={()=>this.onClose()}>Close</button>
              <div className="clear"></div>
            </div>
        </Modal>
      </div>

    );
  }
}


const mapStateToProps = (state) => {
  return {
    model: state.sharedModel
  }
}


export default connect(mapStateToProps)(RoutesOnMapPopup);