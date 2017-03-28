import React from "react";
import { connect } from 'react-redux';
import { IndexRoute } from 'react-router';
import Modal from 'tg-modal';
import Select from "react-select";
import { AdminCMSService } from '../../services/admin-cms.service';
import { adminActionTypes } from "../../actions/adminActionTypes";
import { sharedActionTypes } from "../../../shared/actions/sharedActionTypes";
import { CommonService } from '../../../shared/services/common.service';
import * as Action from "../../../shared/actions/action";
import { Utility } from "../../../../common/utility/";
import EditTeamModal from "../controls/edit-team-modal-popup/";
import JumpTeamModal from "../controls/jump-team-modal-popup/";
import CreateTeamModal from "../controls/create-team-modal-popup/";
import Team from './team';
import ToolBoxControl from "../../../shared/controls/tool-box-control/";
import { menuRenderer } from "../../../shared/controls/menu-renderer/";
import { Constants } from "../../../../common/app-settings/constants";
import ValidationControl from "../../../shared/controls/validation-control";
import RefreshTimeLogger from "../controls/refresh-time-logger/";
import AdminBoroughSiteFilters from "./borough-site-filters"
const team_add_button = require("../../../../assets/img/teams-add-button.png");


/**
 * Middle container for admin section
 */
class AdminMiddleContainer extends React.Component {

    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props);
        this.onCancelCreateTeamDialog = this.onCancelCreateTeamDialog.bind(this);
        this.onOpenCreateTeamDialog = this.onOpenCreateTeamDialog.bind(this);
        this.onOpenEditTeamDialog = this.onOpenEditTeamDialog.bind(this);
        this.onOpenJumpTeamDialog = this.onOpenJumpTeamDialog.bind(this);
        this.onCancelJumpTeamDialog = this.onCancelJumpTeamDialog.bind(this);
        this.fetchBoroughsAndSites = this.fetchBoroughsAndSites.bind(this);
        this.onBoroughChange = this.onBoroughChange.bind(this);
        this.onSiteChange = this.onSiteChange.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);       
        this.fetchCanvassers = this.fetchCanvassers.bind(this);
        this.fetchRoutes = this.fetchRoutes.bind(this);
        this.loadRoutesAndCanvs = this.loadRoutesAndCanvs.bind(this);
        this.onAddTeam = this.onAddTeam.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.registerAutoRefresh = this.registerAutoRefresh.bind(this);   
        this.onTeamsReload = this.onTeamsReload.bind(this);
        this.setFilteredRoutesCanvassers = this.setFilteredRoutesCanvassers.bind(this); 
        this.isSFOUser = false;  
    }  
    /**
     * Set team dialog Open status to true.
     */
    onOpenCreateTeamDialog() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, { IsOpen: true }));
    }

    /**
     * Calls graphQL to add new team and assign relationship to the selected site.
     */
    onAddTeam(teamName) {
        if(teamName){
                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true));
                this.showErrorMessage(Constants.emptyString,Constants.validation.types.success);
                //Adds team and assign relation of the newly added team with the given site and refreshing data of teams.
                AdminCMSService.addTeam(teamName).then(
                    (response) => {
                        if (response.data.createAssignment.id > 0) {
                            AdminCMSService.assignRelationTeamToSite(this.props.model.createTeamModel.selectedSite.siteId, response.data.createAssignment.id)
                                .then((response) => {
                                    this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                                    if (response.data.createAssignmentRelation.id > 0) {
                                        this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, { IsOpen: false }));
                                        this.showErrorMessage(Utility.stringFormat(Constants.messages.createTeamModal.teamAdded, teamName),Constants.validation.types.success);
                                        window.setTimeout(() => {
                                            this.showErrorMessage(Constants.emptyString,Constants.validation.types.success);
                                        }, Constants.messages.defaultMessageTimeout);
                                        this.fetchTeams(this.props.model.filterModel.selectedSite);
                                    }
                                    else
                                    {
                                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                                        this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured,Constants.validation.types.error);
                                    }
                                }).catch((error) => {
                                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                                        this.showErrorMessage(error.message,Constants.validation.types.error);
                                    });
                        }
                    }
                ).catch((error) => {
                    //Show validation error on any error response from service.
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                    this.showErrorMessage(error.message,Constants.validation.types.error);
                });
        }
        else
        {
           //Show validation error on any error response from service.
             this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
             this.showErrorMessage(Constants.messages.createTeamModal.invalidTeamName,Constants.validation.types.error);
        }
    }
    //show hide error meessages
    showErrorMessage(message,errorType){
         this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: message, type: errorType.key  }));
    }
    /**
     * Closes the team dialog.
     */
    onCancelCreateTeamDialog(e) {
        e.preventDefault();
        this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, { IsOpen: false }));
    }

    /**
     * Opens the team popup with the given team.
     */
    onOpenEditTeamDialog(e, teamObject) {      
      this.props.dispatch(Action.getAction(adminActionTypes.SET_EDIT_TEAM_DIALOG_OPEN, { IsOpen: true, teamOpened: teamObject }));
    }
    /**
     * Opens the team popup with the given jump team.
     */
    onOpenJumpTeamDialog(e, teamObject) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_JUMP_TEAM_DIALOG_OPEN, { IsOpen: true, teamOpened: teamObject }));
    }

    /**
     * Closes the jump team popup .
     */
    onCancelJumpTeamDialog(e) {
        e.preventDefault();
        this.props.dispatch(Action.getAction(adminActionTypes.SET_JUMP_TEAM_DIALOG_OPEN, { IsOpen: false }));
    }

    /**
     * Closes the jump team popup .
     */
    onCancelEditTeamDialog(e) {
        if(e.persist())
         e.preventDefault();
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EDIT_TEAM_DIALOG_OPEN, { IsOpen: false }));
    }

    /**
     * Lifecycle method to be called when component did mount.
     * Initializes the fields and fetch boroughs and sites for dropdowns.
     */
    componentDidMount() {
        this.isSFOUser = CommonService.isSFOUser();       
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SITE, { value: null }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_BOROUGH, { value: null }));
        this.boroughsOptions = null;
        this.fetchBoroughsAndSites();   
        //this.registerAutoRefresh();     
    }

    /**
     * Calls graphQL to fetch boroguhs and associated sites.
     */
    fetchBoroughsAndSites() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        AdminCMSService.getBoroughsAndSites() 
            .then(response => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_BOROUGHS_AND_SITES, response.data));
                                // if there is site selcted then fetch all teams of this site
                                if(this.props.model.filterModel.selectedSite)
                                    this.onSiteChange(this.props.model.filterModel.selectedSite);
                            }
                    )
                .catch((error) => {
                        //Show validation error on any error response from service.                    
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showErrorMessage(error.message,Constants.validation.types.error);
            });
    }

    /**
     * Function called when Borough select change event is fired to set the borough as selecetd value and site as null.
     */
    onBoroughChange(value) {        
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SITE, { value: null }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_BOROUGH, { value: value }));
        this.showErrorMessage(Constants.emptyString,Constants.validation.types.success);
        this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_SITE, { value: null }));
        this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_BOROUGH, { value: value }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        window.setTimeout(()=>{
            if(this.props.model.filterModel.selectedSite)
                {
                    this.onSiteChange(this.props.model.filterModel.selectedSite);
                }
        },0)
    }

    /**
     * Function called when Site selecte change event fired. Shows the loader and fetches teams for the selected site from GraphQL.
     */
    onSiteChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SITE, { value: value, showLoader: true }));
        this.fetchTeams(value);      
    }

    /**
     * Calls graphQL to fetch teams for selected site.
     */
    fetchTeams(selectedSite) {
        if(selectedSite){
            this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: true, showTeamLoader: true }));
            AdminCMSService.getTeamsForSelectedSite(selectedSite)
                .then(response => {
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, response.data.site.teams));
                    this.teamsNeedingEscort = Utility.getTeamsNeedingEscort(response.data.site.teams);
                    this.loadRoutesAndCanvs(selectedSite);
                }).catch((error) => {
                        /**
                         * Show validation error on any error response from service.
                         */
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showErrorMessage(error.message,Constants.validation.types.error);
                    });
        }
    }
     // new filtrered records
    setFilteredRoutesCanvassers() {
        let convassersTabSelected = (this.props.sharedModel.tabs.filter((tab) => tab.key === Constants.selectedAdminTab.canvasser && tab.isSelected).length > 0);
        this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: convassersTabSelected }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_STATUS, { selection: this.props.model.rightSideModel.statusModel.selectedCanvOption, convassersTabSelected: convassersTabSelected }));
    }
    /**
    * Calls graphQL to fetch routes for selected site.
    */
    fetchRoutes(selectedSite) {
        AdminCMSService.getRoutesBySite(selectedSite.siteId)
            .then(response => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, response.data.site.routes));
                // mark timespan request executed on
                this.props.dispatch(Action.getAction(adminActionTypes.SET_ADMIN_LAST_UPDATED_ON, {}));
                this.setFilteredRoutesCanvassers();
            }).catch((error) => {
                        this.showErrorMessage(error.message,Constants.validation.types.error);
             });
    }

    /**
    * Calls graphQL to fetch canvassers for selected site.
    */
    fetchCanvassers(selectedSite) {
        AdminCMSService.getUsers(selectedSite.siteId)
            .then(response => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                this.setFilteredRoutesCanvassers();
            }).catch((error) => {
                        this.showErrorMessage(error.message,Constants.validation.types.error);
             });
    }
    /**
     * Loads data for canvassers and routes for selected site.
     */
    loadRoutesAndCanvs(selectedSite) {
        window.setTimeout(() => {
            this.fetchCanvassers(selectedSite);
            this.fetchRoutes(selectedSite);
        }, 0)

    }
   
    onWindowResize() {
        Utility.onWindowResize();
    }

    // reister auto refresh
    registerAutoRefresh() {
        Utility.setAdminInterval(() => {

            Utility.abortAllPromises(() => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            });
            this.onTeamsReload();

        }, this.props.model.panelProperties.panelAutoReloadInterval);
    }
    // teams Reload on auto refresh
    onTeamsReload(){
        if(this.props.model.filterModel.selectedSite){
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
            this.props.dispatch(Action.getAction(adminActionTypes.SET_RIGHT_SIDE_LOADERS, true));
            this.fetchTeams(this.props.model.filterModel.selectedSite);
        }
    }
    /**
     * Render View method.
     */
    render() {
        let adminModel = this.props.model;
        let boroughs = adminModel.filterModel.boroughs;
        this.boroughsOptions = boroughs;
        let selectedBoroughValue = adminModel.filterModel.selectedBorough;
        let sites = adminModel.filterModel.sites;
        let selectedSiteValue = adminModel.filterModel.selectedSite;
        let searchedTeams = this.props.model.searchedTeams;         
        return (
            <div id="content" className="content">
                <div className="validation_success_main">
                    <ValidationControl message={adminModel.validation.message} type={adminModel.validation.type} isPopup={adminModel.validation.isPopup} />
                </div>
                <h1 className="page-header">Admin</h1>
                <div className="clear"></div>
                <div className={'panel panel-inverse ' + (adminModel.panelProperties.panelExpanded ? " panel-expand " : "")}  >
                    <div className="panel-heading">
                        <ToolBoxControl dataModel={adminModel.panelProperties}
                            onExpand={() => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_EXPAND_ADMIN, {}));
                                this.onWindowResize();
                            } }
                            onReload={() => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
                            } }
                            onCollapse={() => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_COLLAPSE_ADMIN, {}));
                                this.onWindowResize();
                            } }
                            onRemove={() => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_REMOVE_ADMIN, {}));
                            } }
                            />
                        <h4 className="panel-title"><panel>Teams ({searchedTeams.length}) </panel>
                            <img src={team_add_button} alt="" className="open-team-add-button" width="20px" onClick={this.onOpenCreateTeamDialog} /></h4>
                    </div>
                    <div className={"panel-body " + (adminModel.panelProperties.panelExpanded ? " custom-scroll " : '') + (adminModel.panelProperties.panelCollapsed ? ' height-0 ' : '')}>


                        <div className="admin-filter-bar">                           
                            <AdminBoroughSiteFilters IsSFUser = {this.isSFOUser} SelectedBoroughValue={selectedBoroughValue} MenuRenderer={menuRenderer}  
                            OnBoroughChange={this.onBoroughChange} BoroughsOptions={this.boroughsOptions}  Sites= {sites} SelectedBoroughValue = {selectedBoroughValue}
                            BoroughDisabled={adminModel.panelProperties.panelReload || (!this.boroughsOptions || this.boroughsOptions.length <=1)}
                            SelectedSiteValue = {selectedSiteValue} OnSiteChange={this.onSiteChange}
                            SitesOptions={this.sitesOptions} SiteDisabled={adminModel.panelProperties.panelReload || (!this.sitesOptions || this.sitesOptions.length<=1)}
                            />
                            { this.props.model.filterModel.selectedSite ?  <RefreshTimeLogger /> : ''}
                            { (searchedTeams && searchedTeams.length) ? <label className='need-escort-count'>{ Constants.teamsNeedingEscorts }&nbsp;<b>{this.teamsNeedingEscort}</b></label> : '' }
                        </div>

                        <div className="admin-teams-content">
                            {
                                searchedTeams && searchedTeams.length ?
                                    searchedTeams.map((team, index) => {
                                        return (
                                            <Team onOpenEditTeamDialog={(e, teamObj) => { team.isJumpTeam ? this.onOpenJumpTeamDialog(e, teamObj) : this.onOpenEditTeamDialog(e, teamObj) } } team={team} key={index} />
                                        );
                                    }) :
                                    ((searchedTeams && searchedTeams.length == 0) && selectedSiteValue && !adminModel.panelProperties.panelReload) ? <div className="no-teams-found-message"> { Constants.messages.noRecordFound }</div> : 
                                                    <div className="select-borough-site-label">{ !this.props.model.filterModel.selectedSite ? (this.isSFOUser ? Constants.messages.selectBoroughSiteSF : Constants.messages.selectBoroughSite) :'' }</div>
                            }
                            {adminModel.panelProperties.panelReload ? <div className="panel-loader"><span className="spinner-small"></span></div> : ''}
                        </div>
                        
                    </div>
                </div>
                {
                    this.props.model.editTeamModalIsOpened ?
                        <EditTeamModal isOpen={this.props.model.editTeamModalIsOpened} onCancel={(e) => this.onCancelEditTeamDialog(e)} loader={this.props.model.popupLoaderShown} />
                        : ''
                }
                {
                    this.props.model.createTeamModalIsOpened ?
                        <CreateTeamModal isOpen={this.props.model.createTeamModalIsOpened} onAddTeam={(e) => this.onAddTeam(e)} onCancel={(e) => this.onCancelCreateTeamDialog(e)} loader={this.props.model.popupLoaderShown} />
                        : ''
                }
                {
                    this.props.model.jumpTeamModalIsOpened ?
                        <JumpTeamModal isOpen={this.props.model.jumpTeamModalIsOpened} onCancel={(e) => this.onCancelJumpTeamDialog(e)} loader={this.props.model.popupLoaderShown} />
                        : ''
                }

            </div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        sharedModel:state.sharedModel
    }
}

export default connect(mapStateToProps)(AdminMiddleContainer);