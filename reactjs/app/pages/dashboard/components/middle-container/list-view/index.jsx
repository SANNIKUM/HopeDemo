import React from "react";
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { compose } from 'redux';
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants"
const route_icon = require("../../../../../assets/img/route-icon.png");
const teams_icon = require("../../../../../assets/img/teams-icon.png");
import { Utility } from "../../../../../common/utility";
import AuthorizedComponent from "../../../../shared/base/authorized-component";

/**
 * List view component.
 */
class ListViewComponent extends AuthorizedComponent {

    /**
     * Constructor to initialize fields.
     */
    constructor(props, context) {
        super(props, context);
        this.onOpenRouteOnMapDialog = this.onOpenRouteOnMapDialog.bind(this);
    }
    /**
     * Set the current tab to list view.
     */
    componentDidMount() {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: Constants.dashBoardViewKey.listView }));
    }

    // open route in map
    onOpenRouteOnMapDialog(routeObject) {        
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true,popupLoaderShown:true,routeObject:routeObject}));
    }
    /**
     * Render View.
     */
    render() {
        let selectedBoroughValue = this.props.model.rightSideModel.filtersModel.selectedBorough;
        let selectedSiteValue = this.props.model.rightSideModel.filtersModel.selectedSite;
        let selectedTeamValue = this.props.model.rightSideModel.filtersModel.selectedTeam;
        let selectedFilterKey = this.props.model.middleFilterModel.filterRoutesSelected.key;
        let searchedRoutes = Utility.getFilteredRoutes(this.props.model.rightSideModel.allRoutes,selectedBoroughValue,selectedSiteValue,selectedTeamValue,selectedFilterKey);
        return (
            searchedRoutes && searchedRoutes.length>0 ? 
        <div>
            <table className="routeList-table routeList-table-rounded">
                <thead>
                    <tr>
                        <th>Route</th>
                        <th>Team</th>
                        <th>Status</th>
                        <th>Borough</th>
                        <th>Site</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                      {  
                    searchedRoutes.map((route, index)=> {

                        return (
                            <tr key={"route-list-view-"+index}>
                                <td>{Utility.getSubwayRouteName(route)} <img src={route_icon} alt="" title="View Route Map" className="route-icon" onClick={()=> {this.onOpenRouteOnMapDialog(route)}} /></td>
                                <td><label className={route.teamLabel ? '' : 'members-route no-members'}>{route.teamLabel ? (route.teamLabel) : 'Unassigned Team'}</label> <img src={teams_icon} alt="" className="route-icon displaynone" /></td>
                                <td className={route.routeStatus == Constants.routeStatusKey.notStarted.key ? 'routeList-table routeList-table-rounded reactable-data teamStatusNotStarted' : (route.routeStatus == Constants.routeStatusKey.completed.key ? 'routeList-table routeList-table-rounded reactable-data teamStatusComplete' : (route.routeStatus == Constants.routeStatusKey.inProgress.key ? 'routeList-table routeList-table-rounded reactable-data teamStatusInProgress' : 'routeList-table routeList-table-rounded reactable-data'))} >{route.routeStatus == Constants.routeStatusKey.notStarted.key ? Constants.routeStatusKey.notStarted.value : (route.routeStatus == Constants.routeStatusKey.completed.key ? Constants.routeStatusKey.completed.value : (route.routeStatus == Constants.routeStatusKey.inProgress.key ? Constants.routeStatusKey.inProgress.value : ''))}</td>
                                <td>{route.boroughName} </td>
                                <td>{route.siteName} </td>
                                <td>{route.routeType}</td>
                            </tr>
                        );
                    })  }  
                </tbody>
            </table>            
            </div>
            
            : (!(this.props.model.middleFilterModel.panelProperties.panelReload) ? <div className="no-route-found-message">{Constants.messages.noRecordFound}</div> :<div></div>)
            
        );
    }

}

let mapStateToProps = (state) => {
    return {
        model: state.dashboardModel,
        sharedModel: state.sharedModel
    }
};

export default connect(mapStateToProps)(ListViewComponent);