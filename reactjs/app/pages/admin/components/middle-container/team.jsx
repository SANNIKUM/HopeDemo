import React, {PropTypes} from "react";
import {connect} from 'react-redux';
import Modal from 'tg-modal';
import Select from "react-select";
import {compose} from 'redux';
import {DropTarget} from 'react-dnd';
import {Utility} from "../../../../common/utility";
import {adminActionTypes} from "../../actions/adminActionTypes";
import * as Action from "../../../shared/actions/action";

import {Constants} from "../../../../common/app-settings/constants";
import {AdminCMSService} from "../../services/admin-cms.service";
import ConfirmDialog from '../../../shared/controls/confirm-dialog-control'
const team_icon = require("../../../../assets/img/teams-icon.png");
const route_icon = require("../../../../assets/img/route-icon.png");
const double_vertical_liner = require("../../../../assets/img/double-vertical-liner.png");

const teamListTarget = {
  drop(props, monitor) {
    let ToggleLoaders = function (showCanvRoutLoader, showTeamLoader) {
      props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, {
        showCanvRoutLoader: showCanvRoutLoader,
        showTeamLoader: showTeamLoader
      }));
    }
    if (monitor.getItemType() === Constants.dragType.canvasser) {
      let canvasser = monitor.getItem();
      //hit service to add canvasser to team and dispatch
      let team = props.team;
      let destroyRelationFromTeamId = -1;
      let allTeams = props
        .model
        .searchedTeams
        .filter((sTeam) => (sTeam.id != team.id));
      for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
        let canvasserIndexToRemove = (allTeams[teamIndex].users.findIndex((user) => (user.id == canvasser.canvasserToBeDropped.canvasser.id)));
        if (canvasserIndexToRemove > -1) {
          destroyRelationFromTeamId = allTeams[teamIndex].id;
          break;
        }
      }
      // first add canvasser to team and then dispatch action to remove the same
      // canvasser from the other team to reinstantiate the DOM
      let createRelationWithTeamId = team.id;
      let assigneeId = canvasser.canvasserToBeDropped.canvasser.id;
      let confirmMessage = Utility.stringFormat(Constants.messages.assignCanvasserToTeam, canvasser.canvasserToBeDropped.canvasser.name, team.label);

      function assignRelationCanvasserToTeam() {
        // start loader on right side
        ToggleLoaders(true, true);
        if (destroyRelationFromTeamId != -1) {
          AdminCMSService
            .destroyRelationCanvasserToTeam(destroyRelationFromTeamId, assigneeId)
            .then((response) => {
              if (response.data.destroyAssignmentRelation == null) {
                console.log("Destroy relation of canvasser to team failure.", response.errors[0].message, canvasser);
                props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, canvasser.canvasserToBeDropped.canvasser.teams[0].name),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                // hide loader on right side
                ToggleLoaders(false, false);
                props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));
              } else {
                AdminCMSService
                  .assignRelationCanvasserToTeam(createRelationWithTeamId, assigneeId)
                  .then((response) => {
                    if (response.data.createAssignmentRelation.id > 0) {
                      props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER_FROM_TEAM, {
                        team: team,
                        canvasser: canvasser.canvasserToBeDropped.canvasser
                      }));
                      AdminCMSService
                        .getUsers(props.model.filterModel.selectedSite.siteId)
                        .then(response => {
                          props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                          // hide loader on right side
                          ToggleLoaders(false, false);                       
                        props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));
                        });
                    } else {
                      props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, canvasser.canvasserToBeDropped.canvasser.teams[0].name),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                      // hide loader on right side
                      ToggleLoaders(false, false);
                    props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));

                    }
                  })
                  .catch((err) => {
                    props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, canvasser.canvasserToBeDropped.canvasser.teams[0].name),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                    // hide loader on right side
                    ToggleLoaders(false, false);
                  });
              }
            })
            .catch((err) => {
              console.log(err.message);
              // hide loader on right side
              ToggleLoaders(false, false);
            });

        } else {
          AdminCMSService
            .assignRelationCanvasserToTeam(createRelationWithTeamId, assigneeId)
            .then((response) => {
              if (response.data.createAssignmentRelation.id > 0) {
                props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER_FROM_TEAM, {
                  team: team,
                  canvasser: canvasser.canvasserToBeDropped.canvasser
                }));
                AdminCMSService
                  .getUsers(props.model.filterModel.selectedSite.siteId)
                  .then(response => {
                    props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                    // hide loader on right side
                    ToggleLoaders(false, false);
                   props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));

                  });
              } else {
                props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, team.label),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                // hide loader on right side
                ToggleLoaders(false, false);
                 props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));

              }
            })
            .catch((err) => {
              props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, team.label),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
              // hide loader on right side
              ToggleLoaders(false, false);
            });
        }

      }

      if (canvasser.canvasserToBeDropped.canvasser.canvasserStatus === "NCI") {
        ConfirmDialog(confirmMessage).then((result) => {
          // proceed func callback
          assignRelationCanvasserToTeam();
        }, (result) => {
          // cancel func callback
        });
      } else {
        assignRelationCanvasserToTeam();
      }
    } else if (monitor.getItemType() === Constants.dragType.route) {
      let route = monitor.getItem();
      let team = props.team;
      
      let destroyRelationFromTeamId = -1;
      let allTeams = props.model.searchedTeams.filter((sTeam) => (sTeam.id != team.id));
      for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
        let routeIndexToRemove = (allTeams[teamIndex].routes.findIndex((rRoute) => (rRoute.id == route.routeToBeDropped.routeId)));
        if (routeIndexToRemove > -1) {
          destroyRelationFromTeamId = allTeams[teamIndex].id;
          break;
        }
      }
      // first add canvasser to team and then dispatch action to remove the same
      // canvasser from the other team to reinstantiate the DOM
      let createRelationWithTeamId = team.id;
      let assigneeId = route.routeToBeDropped.routeId;
      // start loader on right side
      ToggleLoaders(true, true);     
      AdminCMSService.assignRelationRouteToTeam(destroyRelationFromTeamId, createRelationWithTeamId, assigneeId).then((response) => {
          if ((destroyRelationFromTeamId != -1 && response.data.destroyAssignmentRelation) || (destroyRelationFromTeamId == -1)) {
            if (response.data.createAssignmentRelation.id > 0) {            
              //  team.routes.push({ id: route.routeToBeDropped.routeId, name:
              // route.routeToBeDropped.routeName });
              props.dispatch(Action.getAction(adminActionTypes.REMOVE_ROUTE_FROM_TEAM, {
                team: team,route: {
                  id: route.routeToBeDropped.routeId,
                  name: route.routeToBeDropped.routeName,
                  routeName: route.routeToBeDropped.routeName,
                  status: route.routeToBeDropped.routeStatus,
                  routeStatus: route.routeToBeDropped.routeStatus,
                  routeType:  route.routeToBeDropped.routeType,
                  needNypd:  route.routeToBeDropped.routeObject.needNypd
                }
              }));
              AdminCMSService
                .getRoutesBySite(props.model.filterModel.selectedSite.siteId).then(response => {
                  props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, response.data.site.routes));
                  ToggleLoaders(false, false);
                  props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected:false }));

                });
            } else {
              ToggleLoaders(false, false);
            }

          } else {
            ToggleLoaders(false, false);
          }
        });
    }
  },

  canDrop(props, monitor) {
    if (monitor.getItemType() === Constants.dragType.canvasser) {
      let canvasser = monitor.getItem();
      let team = props.team;
      //add validation check to add canvasser

      if (team.users.findIndex((user) => (user.id == canvasser.canvasserToBeDropped.canvasser.id)) != -1) {
        return false;
      }
      return true;
    } else if (monitor.getItemType() === Constants.dragType.route) {
      let route = monitor.getItem();
      let team = props.team;
      //add validation check to add route
      if (team.routes.findIndex((r) => (r.id == route.routeToBeDropped.routeId)) != -1) {
        return false;
      }
      return true;
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

class Team extends React.Component {
  constructor(props) {
    super(props);

  }

  onCancelDialog(e) {
    e.preventDefault();
    this.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, {IsOpen: false}));
  }
  // return assigned routes
  getAssignedRoutes() {
    let assignedRoutes = this.props.team.routes;
    assignedRoutes.forEach((route) => {
      let sector = '';
      let subSector = ''
      let i = 0;
      let routeName = route.name.trim();
      for (i = 0; i < routeName.length; i = i + 1) {
        if (parseInt(routeName[i]) || routeName[i] == 0) {
          sector = sector.toString() + routeName[i].toString();
        } else {
          subSector = subSector + routeName[i];
        }
      }
      route.sector = sector;
      route.subSector = subSector;
    });
    assignedRoutes.sort((a, b) => {
      if (a.sector === b.sector) {
        return a.subSector > b.subSector? 1: a.subSector < b.subSector? -1: 0;
      }
      return parseInt(a.sector) > parseInt(b.sector)? 1: -1;
    });
    return assignedRoutes;
  }
  /**
   * render html code
   */
  render() {
    const {connectDropTarget, isOver} = this.props;
    const team = this.props.team;
    let assignedRoutes = this.getAssignedRoutes();
    return (
      connectDropTarget(
        <div className="team-row" key={team.id}>
          <div className="team-left padding-custom-15-20">
            <span onClick={(e) => { this.props.onOpenEditTeamDialog(e, team) } } className="team-name-admin-label">{team.label}</span>
          </div>
          <div className="team-right">
            <div className="teams-routes-section">
              <div className="single-liner single-line-div" ></div>
              <div className="team-details">
                {team.routes.length === 0 ? <label className="members-count no-members">{team.routes.length + " "}Routes</label> :
                  <label className="members-count">{team.routes.length + " "} {team.routes.length === 1 ? 'Route' : 'Routes'} </label>
                }
                <label className="members-route clipped">
                  {
                    team.routes.length == 0 ? <span className="unassigned-team">Unassigned Route</span> :
                      assignedRoutes.map((route, index) => 
                        <span key={"teams-routes-"+index}>{ Utility.getSubwayRouteName(route) } {((route.needNypd && route.needNypd.toLowerCase() === Constants.routeNeedNYPD.true.toLowerCase()) ? <span className="need_nypd_admin  need_nypd_admin_active">NYPD</span> : '')}{team.routes.length - 1 === index ? '' : ','}&nbsp;&nbsp;</span>                     
                      )
                  }
                </label>
              </div>
            </div>
            <div className="teams-members-section">
              <div className="single-liner single-line-div" ></div>
              <div className="team-details">
                {team.users.length === 0 ? <label className="members-count no-members">{team.users.length + " "}Members</label> :
                  <label className="members-count">{team.users.length + " "} {team.users.length === 1 ? 'Member' : 'Members'} </label>
                }
                <div className="team-all-members">
                  
                     <div className="table-responsive">          
                        <table className="table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>                              
                              </tr>
                            </thead>
                            <tbody>
                              
                              {
                                team.users.length == 0 ? '' :
                                    team.users.map((user,index) => 
                                            <tr key={"team-member-key"+index}>
                                              <td>{index+1}</td>
                                              <td>{user.name}</td>
                                              <td>{user.email}</td>
                                            </tr>
                                    )
                             }
                            </tbody>
                        </table>
                       </div>
                      
                </div>
              </div>
            </div>
          </div>
          <div className="clear">
          </div>
          <hr className="horizontal-liner" />
          {isOver ? <div className='drag-hover' /> : ''}


      </div>

    ));
  }

}

/**
 * initialize current state
 */
const mapStateToProps = (state) => {
  return {model: state.adminModel}
}

Team.propTypes = {
  isOver: PropTypes.bool.isRequired
};

export default compose(connect(mapStateToProps), DropTarget([
  Constants.dragType.canvasser, Constants.dragType.route
], teamListTarget, collect))(Team);