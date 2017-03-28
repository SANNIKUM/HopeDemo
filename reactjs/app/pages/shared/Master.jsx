import React from 'react';
import { connect } from 'react-redux';

import LeftMenu from "./left-menu/";
import AppHeader from "./header-component/";
import { LoginService }  from "../login/services/login.service.jsx";
import { sharedActionTypes } from "./actions/sharedActionTypes";
import RoutesOnMapPopup from "./controls/routes-on-map-control/";
import * as Action from "./actions/action";

/**
 * Master component containing the header and left menu component..
 */
class Master extends React.Component {
    /**
     * Constructor to initialize fields.
     */
   constructor(props,children) {
       super(props);
        this.checkLogin = this.checkLogin.bind(this);
   }
   /**
    * Check login before mount lifecycle is called.
    */
   componentWillMount(){
       this.checkLogin();
   }
  /**
   * Check login.
   */
   checkLogin(){
     let sessionDetails=LoginService.checkLogin();
     if(sessionDetails){
         this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOGGED_IN,  { isLoggedIn: sessionDetails.isLoggedIn, userName: sessionDetails.userName, displayName: sessionDetails.displayName,userId:sessionDetails.userId }));
     }
   }

   /**
    * Render view.
    */
   render() {
      return (
          <div>
            <div id="page-container" className={ "page-header-fixed page-sidebar-fixed page-with-two-sidebar "+(!this.props.sharedModel.leftMenuExpaned ? "page-sidebar-minified ":"")+ (!this.props.sharedModel.isRightPanelExpanded ? " right-sidebar-minified ":"")}>
                  <AppHeader />
                  <LeftMenu />
                  {this.props.children}
            </div>
            {
                    this.props.sharedModel.routesOnMap.isOpened ?
                        <RoutesOnMapPopup isOpen={this.props.sharedModel.routesOnMap.isOpened}  loader={this.props.sharedModel.routesOnMap.popupLoaderShown} />
                        : ''
            }
          </div>
      );
  }


}

function mapStatToProps(state){
    return {
        sharedModel:state.sharedModel
    };
}
export default connect(mapStatToProps)(Master);
