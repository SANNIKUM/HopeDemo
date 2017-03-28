import React from "react";
import { connect } from 'react-redux';
import { AdminCMSService } from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import {sharedActionTypes} from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { Utility } from "../../../../../common/utility";
import ConfirmDialog from '../../../../shared/controls/confirm-dialog-control';
const route_icon = require("../../../../../assets/img/route-icon.png");
import RouteType from "../route-type/"
/**
 * Component to list of routes
 */
class RouteList extends React.Component {
    constructor(props) {
        super(props);
        this.onRouteRemove = this.onRouteRemove.bind(this);
        this.onRouteAllRemove = this.onRouteAllRemove.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.getRouteClassName = this.getRouteClassName.bind(this);
        this.onOpenRouteOnMapDialog = this.onOpenRouteOnMapDialog.bind(this);
    }
    // open route in map
    onOpenRouteOnMapDialog(routeObject) {  
        routeObject.boroughName = this.props.model.filterModel.selectedBorough.boroughName;     
        routeObject.siteName = this.props.model.filterModel.selectedSite.siteName;     
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true,popupLoaderShown:true,routeObject:routeObject}));
    }
    /**
     * Remove routes from the list
     */
    onRouteRemove(route) {

        let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.routeRemoveConfirm, route.name, this.props.model.teamToEdit.name);
        ConfirmDialog(confirmMessage).then(
            (result) => {
                this.showLoader(true);
                AdminCMSService.destroyRelationFrom(route.id, this.props.model.teamToEdit.id).then((response) => {
                    if (response.data.destroyAssignmentRelation) {
                        this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM_ROUTE, { teamId: this.props.model.teamToEdit.id, routeId: route.id }));
                        this.showLoader(false);
                        AdminCMSService.getRoutesBySite(this.props.model.filterModel.selectedSite.siteId)
                            .then(response => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, response.data.site.routes));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected: false }));
                            });

                        window.setTimeout(() => {
                            this.showMessage(Constants.emptyString);
                        }, Constants.messages.defaultMessageTimeout);

                    } else {
                        console.log("Destroy relation of route to team failure.");
                        throw new Error(Constants.messages.commonMessages.someErrorOccured);
                    }
                }).catch((err) => {
                    this.showMessage(err.message);
                    this.showLoader(false);
                });
            },
            (result) => {
                this.showMessage(Constants.emptyString);
            }
        );
    }
    /**
     * Remove all routes from the list in one go
     */
    onRouteAllRemove() {
        let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.allRoutesRemoveConfirm, this.props.model.teamToEdit.name);
        ConfirmDialog(confirmMessage).then(
            (result) => {
                if (this.props.model.teamToEdit.routes && this.props.model.teamToEdit.routes.length > 0) {
                    let routeIds = [];
                    this.showLoader(true);
                    this.props.model.teamToEdit.routes.forEach((routeObj, index) => {
                        routeIds.push(routeObj.id);
                    })
                    AdminCMSService.destroyRelationOfAllFrom(this.props.model.teamToEdit.id, routeIds).then((response) => {
                        this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM_ALL_ROUTE, { teamId: this.props.model.teamToEdit.id }));
                        this.showLoader(false);
                        AdminCMSService.getRoutesBySite(this.props.model.filterModel.selectedSite.siteId)
                            .then(response => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, response.data.site.routes));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected: false }));
                            });
                    }).catch((err) => {
                        this.showMessage(err.message);
                        this.showLoader(false);
                    });
                }
            },
            (result) => {
                this.showMessage(Constants.emptyString);
            }
        );
    }
    // show message
    showMessage(message, type) {
        if (!type) {
            type = Constants.validation.types.error.key;
        }
        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: message, isPopup: false, type: type }));
    }
    // show hide loader
    showLoader(flag) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, flag));
    }

    // get routes class to be added based on their status
    getRouteClassName(routeObject) {
        let bgColor = "";
        if (routeObject && routeObject.routeStatus) {
            bgColor = this.props.sharedModel.filterRoutesStatuses.find(f => f.key.toLowerCase() == routeObject.routeStatus.toLowerCase()).layerColor;
        }

        return bgColor;
    }
    /**
     * render route list
     */
    render() {
        return <div>
            <div className="team-routes custom-scroll">
                {
                    this.props.model.teamToEdit.routes.length ?
                        this.props.model.teamToEdit.routes.map((route, index) => {
                            return (
                                <div className="team-row" key={"team-route-" + index} style={{ borderLeftColor: this.getRouteClassName(route), borderLeftWidth: "10px", borderLeftStyle: "solid" }}>
                                    <span className="pull-left">({(index + 1)}). </span> <div className="team-routes-left">
                                        <span className="team-route-name">{Utility.getSubwayRouteName(route)}</span>
                                        <img src={route_icon} alt="" title="View Route Map" className="route-icon margin-left-5px" onClick={()=> {this.onOpenRouteOnMapDialog(route)}} />
                                        {(route.needNypd && route.needNypd.toLowerCase() === Constants.routeNeedNYPD.true.toLowerCase()) ? <span className="need_nypd_admin  need_nypd_admin_active">NYPD</span> : null}                                        
                                    </div>
                                    <div className="team-routes-right">
                                        <span className="team-route-type" style={{ "float": "left" }}>Type :</span>
                                        <span style={{ float: "right", width: "50%", marginRight: "30%" }}><RouteType team={this.props.model.teamToEdit} route={route}/> </span>
                                    </div>
                                    <i className="fa fa-times-circle-o remove-row-icon" onClick={() => { this.onRouteRemove(route) } } title="Remove route from team."></i>
                                    <div className="clear"></div>
                                </div>
                            )
                        })
                        : <div className="team-row no-routes">{Constants.messages.noTeamRoute}</div>

                }
            </div>
            <div className="footer-bar text-align-right">
                <button className="button remove-routes-button" disabled={!this.props.model.teamToEdit.routes.length} onClick={() => { this.onRouteAllRemove() } } >Remove All Routes</button>
                <div className="clear"></div>
            </div>
        </div>
    }
}
/**
 * inject the current state
 */
const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        sharedModel: state.sharedModel
    }
}

export default connect(mapStateToProps)(RouteList);