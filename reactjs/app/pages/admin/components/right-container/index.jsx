import React from "react";
import { connect } from "react-redux";
import { AdminCMSService } from '../../services/admin-cms.service';
import { adminActionTypes } from "../../actions/adminActionTypes";
import { sharedActionTypes } from "../../../shared/actions/sharedActionTypes";
import * as Action from "../../../shared/actions/action";
import CreateCanvasserModal from '../controls/create-canvasser-modal-popup/';
import TabSwitchControl from '../controls/tab-switcher/';
import { Utility } from "../../../../common/utility/";
import RightSideFilterComponent from './filter/';
import { Constants } from "../../../../common/app-settings/constants"
import ConfirmDialog from '../../../shared/controls/confirm-dialog-control';

class AdminRightContainerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.onCancelDialog = this.onCancelDialog.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.setTeam = this.setTeam.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onAddUpdateDeleteCanvasser = this.onAddUpdateDeleteCanvasser.bind(this);
    this.showHideLoader = this.showHideLoader.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.setFilteredRoutesCanvassers = this.setFilteredRoutesCanvassers.bind(this);
  }
  onTabChange(tabObject) {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: tabObject.key }));
    window.location.href = '#/admin/' + tabObject.key;
  }

   // assign team to convesser
  setTeam(canvesserTeamModel){     
      //hit service to add canvasser to team and dispatch
      let team = canvesserTeamModel.team;
      let destroyRelationFromTeamId = -1;
      let createRelationWithTeamId = team.teamId;
      let assigneeId = canvesserTeamModel.canvasser.id;   
      let allTeams = this.props
        .model
        .searchedTeams
        .filter((sTeam) => (sTeam.id != createRelationWithTeamId));
      for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
        let canvasserIndexToRemove = (allTeams[teamIndex].users.findIndex((user) => (user.id == assigneeId)));
        if (canvasserIndexToRemove > -1) {
          destroyRelationFromTeamId = allTeams[teamIndex].id;
          break;
        }
      }
      // first add canvasser to team and then dispatch action to remove the same
      // canvasser from the other team to reinstantiate the DOM     
      this.assignRelationCanvasserToTeam(destroyRelationFromTeamId, createRelationWithTeamId,  assigneeId, canvesserTeamModel );   

  }

   assignRelationCanvasserToTeam(destroyRelationFromTeamId, createRelationWithTeamId, assigneeId, canvesserTeamModel) {
        // start loader on right side        
        if (destroyRelationFromTeamId != -1) {
          debugger;
          AdminCMSService
            .destroyRelationCanvasserToTeam(destroyRelationFromTeamId, assigneeId)
            .then((response) => {
              if (response.data.destroyAssignmentRelation == null) {
                console.log("Destroy relation of canvasser to team failure.", response.errors[0].message, canvesserTeamModel.canvasser);
                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvesserTeamModel.canvasser.name, canvesserTeamModel.team.teamName),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  this.props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);                
              } else if(createRelationWithTeamId!=0){              
                AdminCMSService
                  .assignRelationCanvasserToTeam(createRelationWithTeamId, assigneeId)
                  .then((response) => {
                    if (response.data.createAssignmentRelation.id > 0) {
                      this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER_FROM_TEAM, {
                        team: canvesserTeamModel.team,
                        canvasser: canvesserTeamModel.canvasser
                      }));
                       debugger;
                      AdminCMSService
                        .getUsers(this.props.model.filterModel.selectedSite.siteId)
                        .then(response => {                           
                          this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                          this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: true, showTeamLoader: true }));                         
                          AdminCMSService.getTeamsForSelectedSite(this.props.model.filterModel.selectedSite)
                           .then(response => {
                                     this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, response.data.site.teams));
                                    this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: false, showTeamLoader: false }));    

                                     //this.loadRoutesAndCanvs(selectedSite);
                                }).catch((error) => {
                        /**
                         * Show validation error on any error response from service.
                         */
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showErrorMessage(error.message,Constants.validation.types.error);
                    });
                                             
                        });
                    } else {
                      this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvesserTeamModel.canvasser.name, canvesserTeamModel.team.teamName),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  this.props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                    
                    }
                  })
                  .catch((err) => {
                    this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvesserTeamModel.canvasser.name, canvesserTeamModel.team.teamName),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  this.props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                 
                  });
              }else{
                this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER_FROM_TEAM, {
                        team: canvesserTeamModel.team,
                        canvasser: canvesserTeamModel.canvasser
                      }));
                       debugger;
                      AdminCMSService
                        .getUsers(this.props.model.filterModel.selectedSite.siteId)
                        .then(response => {                           
                          this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                          this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: true, showTeamLoader: true }));                         
                          AdminCMSService.getTeamsForSelectedSite(this.props.model.filterModel.selectedSite)
                           .then(response => {
                                     this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, response.data.site.teams));
                                    this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: false, showTeamLoader: false }));    

                                     //this.loadRoutesAndCanvs(selectedSite);
                                }).catch((error) => {
                        /**
                         * Show validation error on any error response from service.
                         */
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showErrorMessage(error.message,Constants.validation.types.error);
                    });
                                             
                        });
              }
              
            })
            .catch((err) => {
              console.log(err.message);
             
            });

        } else {
          AdminCMSService
            .assignRelationCanvasserToTeam(createRelationWithTeamId, assigneeId)
            .then((response) => {
              if (response.data.createAssignmentRelation.id > 0) {
                this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER_FROM_TEAM, {
                  team: canvesserTeamModel.team,
                  canvasser: canvesserTeamModel.canvasser
                }));
                AdminCMSService
                  .getUsers(this.props.model.filterModel.selectedSite.siteId)
                  .then(response => {     
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                         this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: true, showTeamLoader: true }));                         
                          AdminCMSService.getTeamsForSelectedSite(this.props.model.filterModel.selectedSite)
                           .then(response => {
                                     this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, response.data.site.teams));
                                       this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: false, showTeamLoader: false }));    
                                    // this.loadRoutesAndCanvs(selectedSite);
                                }).catch((error) => {
                        /**
                         * Show validation error on any error response from service.
                         */
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showErrorMessage(error.message,Constants.validation.types.error);
                    });                
                  });
              } else {
                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvesserTeamModel.name, canvesserTeamModel.team.teamName),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  this.props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
              
              }
            })
            .catch((err) => {
             this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvesserTeamModel.name, canvesserTeamModel.team.teamName),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  this.props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);               
            });
          }
      }
  // add/update/delete a canvasser 
  onAddUpdateDeleteCanvasser(canvasser) {
    if (canvasser != null) {
      this.showHideLoader(true);
      switch (canvasser.action) {
        case Constants.action.add:
          //add canvasser and add relation
          AdminCMSService.addCanvasser(canvasser).then((response) => {

            if (response.data.createAssignment && response.data.createAssignment.id > 0) {
              canvasser.id = response.data.createAssignment.id;
              AdminCMSService.updateCanvasserSiteRelation(canvasser.id, this.props.model.filterModel.selectedSite.siteId).then((response) => {
                AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId).then(response => {
                  this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                  if(canvasser.teamId && canvasser.isTeamChanged){
                  let canvesserTeamModel = {canvasser : canvasser, team: {teamId: canvasser.teamId, teamName: canvasser.teamName }};                  
                  this.setTeam(canvesserTeamModel);
                  }    
                  this.showHideLoader(false);
                  this.setFilteredRoutesCanvassers();
                  this.onCancelDialog();
                  this.showMessage(Utility.stringFormat(Constants.messages.createEditCanvasser.canvasserAdded, canvasser.firstName + " " + canvasser.lastName), Constants.validation.types.success.key);
                  window.setTimeout(() => {
                    this.showMessage(Constants.emptyString, Constants.validation.types.success.key);
                  }, Constants.messages.defaultMessageTimeout);
                })
                  .catch((err) => {
                    this.showHideLoader(false);
                    this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key);
                  });
              })
                .catch((err) => {
                  this.showHideLoader(false);
                  this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key);
                });
            } else {
              this.showHideLoader(false);
              this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key);
            }
          })
            .catch((err) => {
              this.showHideLoader(false);
              this.showMessage(err.message, Constants.validation.types.error.key)
            });
          break;
        case Constants.action.update:
          //update canvasser
          AdminCMSService.updateCanvasser(canvasser).then((response) => {
            if (response.data.updateAssignment && response.data.updateAssignment.id > 0) {
              AdminCMSService.getTeamsForSelectedSite(this.props.model.filterModel.selectedSite).then(response => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, response.data.site.teams));
                 let canvesserTeamModel = {canvasser : canvasser, team: {teamId: canvasser.teamId, teamName: canvasser.teamName }};                  
                  this.setTeam(canvesserTeamModel);
                //this.loadRoutesAndCanvs(selectedSite);
              })
                .catch((error) => {
                  //Show validation error on any error response from service.
                  this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                  this.showMessage(error.message, Constants.validation.types.error.key);
                });

              AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId).then(response => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                this.setFilteredRoutesCanvassers();
                this.showHideLoader(false);
                this.onCancelDialog();
                this.showMessage(Utility.stringFormat(Constants.messages.createEditCanvasser.canvasserUpdated, canvasser.firstName + " " + canvasser.lastName), Constants.validation.types.success.key);
                window.setTimeout(() => {
                  this.showMessage(Constants.emptyString, Constants.validation.types.success.key);
                }, Constants.messages.defaultMessageTimeout);
              });
            }
            else {
              this.showHideLoader(false);
              this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key);
            }
          });
          break;
        case Constants.action.delete:
          {
            let name = (!canvasser.firstName && !canvasser.lastName) ? canvasser.email : (!canvasser.firstName && canvasser.lastName ? canvasser.lastName : (canvasser.firstName && !canvasser.lastName ? (canvasser.firstName) : (canvasser.firstName + " " + canvasser.lastName)));
            let confirmMessage = Utility.stringFormat(Constants.messages.createEditCanvasser.canvasserDeleteConfimMsg, name);
            let hasNotification = (canvasser.teams && canvasser.teams.length);
            let notificationMsg = "";
            if (hasNotification) {
              notificationMsg = Utility.stringFormat(Constants.messages.createEditCanvasser.canvasserTeamRelationMsg, name, canvasser.teams[0].name);
            }
            ConfirmDialog(confirmMessage, { notification: hasNotification ? notificationMsg : null }).then(
              (result) => {
                AdminCMSService.deleteCanvasser(canvasser).then((response) => {
                  if (response.data.destroyAssignment) {
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
                    AdminCMSService.getTeamsForSelectedSite(this.props.model.filterModel.selectedSite).then(response => {
                      this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                      this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, response.data.site.teams));
                    })
                      .catch((error) => {
                        // Show validation error on any error response from service.
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showMessage(error.message, Constants.validation.types.error.key);
                      });

                    AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId).then(response => {
                      this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                      this.setFilteredRoutesCanvassers();
                      this.showHideLoader(false);
                      this.onCancelDialog();
                      this.showMessage(Utility.stringFormat(Constants.messages.createEditCanvasser.canvasserDeleted, name), Constants.validation.types.success.key);
                      window.setTimeout(() => {
                        this.showMessage(Constants.emptyString, Constants.validation.types.success.key);
                      }, Constants.messages.defaultMessageTimeout);
                    });
                  }
                  else {
                    this.showHideLoader(false);
                    this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key);
                  }
                }).catch((err) => {
                  this.showHideLoader(false);
                  this.showMessage(err.message, Constants.validation.types.error.key)
                });
              },
              (reponse) => {
                this.showHideLoader(false);
              }
            )

            break;
          }
      }
    }
  }
  // new filtrered records
  setFilteredRoutesCanvassers() {
    window.setTimeout(()=>{
      let convassersTabSelected = (this.props.sharedModel.tabs.filter((tab) => tab.key === Constants.selectedAdminTab.canvasser && tab.isSelected).length > 0);
      this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: convassersTabSelected }));
      this.props.dispatch(Action.getAction(adminActionTypes.SET_STATUS, { selection: this.props.model.rightSideModel.statusModel.selectedCanvOption, convassersTabSelected: convassersTabSelected }));
    },0)
  }
  // on closing the dialog
  onCancelDialog() {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_CONVASSERS_DIALOG_OPEN, { IsOpen: false }));
  }
  // show hide loader on popup
  showHideLoader(flag) {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, flag));
  }
  // show error messages
  showMessage(message, key) {
    this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
      validationMessage: message,
      isPopup: false,
      type: key
    }));
  }
  onExpand() {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_RIGHT_SIDE_EXPANDED, {}));
  }
  render() {

    this.searchedCanvassers = this.props.model.rightSideModel.searchedCanvassers;

    return (
      <div>
        <div id="sidebar-right" className={"sidebar sidebar-right " + (this.props.sharedModel.smallScreenRightMenuOpened ? " right_menu_small_screen_toggled " : '')}>
          <div className="position-relative">
            {this.props.model.routeCanvasLoaderShown ? <div className="canv-route-loader"> <span className="spinner-small"></span> </div> : ''}
            <ul className="nav m-t-10">
              <li className="nav-widget">
                <RightSideFilterComponent />
              </li>
              <li className="nav-tabs-admin">
                <TabSwitchControl tabs={this.props.sharedModel.tabs.filter((tab) => tab.category === "admin")} onTabChange={this.onTabChange} />
              </li>
              {this.props.children}
              <li className="nav-widget minify-button-container">
                <a
                  href="javascript:;"
                  className="sidebar-minify-btn right-side-bar-minify-button-admin"
                  onClick={this.onExpand}>
                  <i className="fa  fa-angle-double-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="right-side-bar-bg-overlay">
          <a
            href="javascript:void(0);"
            className="sidebar-minify-btn right-side-bar-minify-button"
            onClick={this.onExpand}>
            <i className="fa  fa-angle-double-left"></i>
          </a>
        </div>
        {this.props.model.rightSideModel.createCanvasserModalIsOpened
          ? <CreateCanvasserModal
            isOpen={this.props.model.rightSideModel.createCanvasserModalIsOpened}
            loader={this.props.model.popupLoaderShown}
            data={this.props.model.rightSideModel.editCanvasser}
            onDelete={(e) => this.onCancelDialog(e)}
            onCancel={(e) => this.onCancelDialog(e)}
            onAddUpdateDeleteCanvasser={(newCanvasser) => this.onAddUpdateDeleteCanvasser(newCanvasser)} />
          : ''}
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return { model: state.adminModel, sharedModel: state.sharedModel }
};
export default connect(mapStateToProps)(AdminRightContainerComponent);