import { adminActionTypes } from "../actions/adminActionTypes.jsx";
import { adminState } from "../state/";
import { Utility } from "../../../common/utility/index.jsx";
import { Constants } from "../../../common/app-settings/constants";
import { AuthorizationRules } from "../../shared/services/authorization.rules";

export default (state = adminState, action) => {

    let stateCopy = {};
    /**
     * Creates a copy of the state on which actions will be performed.
     */
    if (adminActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {

        case adminActionTypes.SET_BOROUGHS_AND_SITES:
            /**
             * sets boroughs and sites fetched from graphQL.
             */
            {
                let data = action.payload;
                if (data != null && data.boroughs && data.boroughs.length > 0) {
                    stateCopy.filterModel.boroughs = [];
                    stateCopy.filterModel.sites = [];
                    data.boroughs.forEach((borough)=>{
                        stateCopy.filterModel.boroughs.push({ boroughId: borough.id, boroughName: borough.name });
                        if (borough.sites != null && borough.sites.length > 0) {
                            borough.sites.forEach(site => {
                                stateCopy.filterModel.sites.push({ boroughId: borough.id, siteId: site.id, siteName: site.name });
                            })
                        }
                    })
                    stateCopy.filterModel.sites.sort((a, b) => {
                        return (a.siteName.trim() < b.siteName.trim() ? -1 : (a.siteName.trim() > b.siteName.trim() ? 1 : 0));
                    });
                }

                let currentUserBoroughs = AuthorizationRules.getCurrentUserBoroughNames();
                if (currentUserBoroughs) {
                    stateCopy.filterModel.boroughs = stateCopy.filterModel.boroughs.filter((m) => currentUserBoroughs.indexOf(m.boroughName.replace(/ /g, '').toLowerCase()) > -1 || m.boroughId == -1);
                }
                let currentUserSites = AuthorizationRules.getCurrentUserSiteNames();
                if (currentUserSites) {
                    stateCopy.filterModel.sites = stateCopy.filterModel.sites.filter((m) => (currentUserSites.indexOf(m.siteName.replace(/ /g, '').toLowerCase()) > -1) || m.siteId == -1);
                }

                // select item if there is only one in the list of Borough/Site/Teams
                let allBoroughs = stateCopy.filterModel.boroughs.filter(m => m.boroughId != -1);
                if (allBoroughs && allBoroughs.length == 1) {
                    stateCopy.createTeamModel.selectedBorough = stateCopy.filterModel.selectedBorough = allBoroughs[0];
                }
                else
                    stateCopy.filterModel.selectedBorough = null;

                let allSites = stateCopy.filterModel.sites.filter((site) => (site.siteId != -1));
                if (allSites && allSites.length == 1) {
                    stateCopy.createTeamModel.selectedSite = stateCopy.filterModel.selectedSite = allSites[0];
                }
                else
                    stateCopy.filterModel.selectedSite = null;


                return stateCopy;
            }
        case adminActionTypes.REMOVE_ROUTE_FROM_TEAM:
            /**
             * Removes a route from team.
             */
            {
                if (action.payload && action.payload.team) {
                    let route = action.payload.route;
                    let team = action.payload.team;
                    if (stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id)).length == 1)
                        stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id))[0].routes.push(route);
                    let allTeams = stateCopy
                        .searchedTeams
                        .filter((sTeam) => (sTeam.id != team.id));
                    for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
                        let routeIndexToRemove = (allTeams[teamIndex].routes.findIndex((rRoute) => (rRoute.id == route.id)));
                        if (routeIndexToRemove > -1) {
                            allTeams[teamIndex]
                                .routes
                                .splice(routeIndexToRemove, 1);
                            break;
                        }
                    }
                }
                return stateCopy;
            }
        case adminActionTypes.REMOVE_CANVASSER_FROM_TEAM:
            /**
             * Removes canvasser from team.
             */
            {
                let team = action.payload.team;
                let canvasser = action.payload.canvasser;
                if (stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id)).length == 1)
                    stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id))[0].users.push(canvasser);
                let allTeams = stateCopy
                    .searchedTeams
                    .filter((sTeam) => (sTeam.id != team.id));
                for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
                    let canvasserIndexToRemove = (allTeams[teamIndex].users.findIndex((user) => (user.id == canvasser.id)));
                    if (canvasserIndexToRemove > -1) {
                        allTeams[teamIndex]
                            .users
                            .splice(canvasserIndexToRemove, 1);
                        break;
                    }
                }
                return stateCopy;
            }

        case adminActionTypes.SET_TEAMS_SEARCHED:
            /**
             *Set the teams searched for a given site and sorts the data.
             */
            {
                stateCopy.searchedTeams = action.payload;
                stateCopy.searchedTeams.sort(Utility.sortTeamByNameAsc("label"));
                stateCopy.panelProperties.panelReload = false;
                return stateCopy;
            }

        case adminActionTypes.SET_KEYWORD_SEARCH:
            /**
             * Filter data when keyword search is performed.
             */
            {
                // Filter data when keyword search is performed on canvasser. Filtering is
                // applied on canvassers's firtName, lastName, email and canvasser's status.
                if (action.payload.convassersTabSelected) {
                    stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption = action.payload.value;

                    if (stateCopy.rightSideModel.statusModel.selectedCanvOption.value != Constants.defaultSelectedOption)
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers.filter((canvasser) => (canvasser.canvasserStatus === stateCopy.rightSideModel.statusModel.selectedCanvOption.value));
                    else
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers;

                    if (stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption)
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.searchedCanvassers.filter((canvasser) =>
                            ((canvasser.name && canvasser.name.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0)
                                || (canvasser.firstName && canvasser.firstName.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0)
                                || (canvasser.lastName && canvasser.lastName.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0)
                                || (canvasser.email && canvasser.email.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0)));

                } else {
                    // Filter data when keyword search is performed on routes. Filtering is applied
                    // on route name and status.
                    stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption = action.payload.value;

                    stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.initialSearchedRoutes.filter((item) => (Constants.routeStatusKey.assigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (item.teams && item.teams.length) : (Constants.routeStatusKey.unAssigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (!item.teams || (item.teams.length == 0)) : true)));

                    if (stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption)
                        stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.searchedRoutes.filter((route) => (route.name && route.name.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0));
                }
                return stateCopy;
            }
        case adminActionTypes.SET_STATUS:
            /**
             * Filter data on status change.
             */
            {
                //Filtering on canvasser's data.
                if (action.payload.convassersTabSelected) {
                    stateCopy.rightSideModel.statusModel.selectedCanvOption = action.payload.selection;
                    if (stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption) {
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers.filter((canvasser) =>
                            ((canvasser.name && canvasser.name.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)
                                || (canvasser.firstName && canvasser.firstName.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)
                                || (canvasser.lastName && canvasser.lastName.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)
                                || (canvasser.email && canvasser.email.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)));
                    }
                    else
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers;

                    if (stateCopy.rightSideModel.statusModel.selectedCanvOption.value != Constants.defaultSelectedOption)
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.searchedCanvassers.filter((item) => (item.canvasserStatus === stateCopy.rightSideModel.statusModel.selectedCanvOption.value));
                } else {
                    //Filtering on route's data.
                    stateCopy.rightSideModel.statusModel.selectedRoutesOption = action.payload.selection;

                    if (stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption)
                        stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.initialSearchedRoutes.filter((route) => (route.name.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption.toLowerCase()) >= 0));
                    else
                        stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.initialSearchedRoutes;

                    stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.searchedRoutes.filter((item) => (Constants.routeStatusKey.assigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (item.teams && item.teams.length) : (Constants.routeStatusKey.unAssigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (!item.teams || (item.teams.length == 0)) : true)));

                }
                return stateCopy;
            }
        case adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS:
            {
                /**
                 * Set canvasser's searched results for given borough and site.
                 */
                stateCopy.rightSideModel.initialSearchedCanvassers = action.payload;
                if (!stateCopy.rightSideModel.hasOwnProperty("initialSearchedCanvassers")) {
                    stateCopy.rightSideModel["initialSearchedCanvassers"] = [];
                }

                //below two for loop shgould be deleted when service in-iplace.

                stateCopy
                    .rightSideModel
                    .initialSearchedCanvassers
                    .forEach((canvasser)=> {
                        if (!canvasser.hasOwnProperty("canvasserStatus")) {
                            canvasser["canvasserStatus"] = Constants.emptyString;
                        }
                    });

                stateCopy.rightSideModel.initialSearchedCanvassers.forEach((canvasser) =>{
                    if (canvasser.teams.length === 0) {
                        canvasser.canvasserStatus = Constants.canvasserStatus.unAssigned.key;
                    } else {
                        canvasser.canvasserStatus = Constants.canvasserStatus.assigned.key;
                    }
                })
                stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers;
                return stateCopy;
            }

        case adminActionTypes.SET_ROUTES_SEARCHED_RESULTS:
            {
                //Set routes searched results for a given borough and site.
                if (action.payload) {
                    action.payload.forEach(route => {
                        route.routeStatus = (route.routeStatus ? route.routeStatus : Constants.routesStatus.not_started);
                    })
                }
                stateCopy.rightSideModel.searchedRoutes = action.payload;
                stateCopy.rightSideModel.initialSearchedRoutes = stateCopy.rightSideModel.searchedRoutes;
                stateCopy.routeCanvasLoaderShown = false;
                return stateCopy;
            }

        case adminActionTypes.SET_LOG_OUT:
            {
                return adminState; // Reset to Original State after Logout
            }
        case adminActionTypes.SET_EDIT_CANVASSER_DIALOG_OPEN:
            {
                /**
                 * Update state for when canvassers dialog is opened in edit mode to prefilled the data like firstName, last Name and email.
                 */
                stateCopy.rightSideModel.createCanvasserModalIsOpened = action.payload.IsOpen;
                if (stateCopy.rightSideModel.createCanvasserModalIsOpened) {
                    stateCopy.rightSideModel.editCanvasser = action.payload.canvasser;
                } else {
                    stateCopy.rightSideModel.editCanvasser = null;
                }
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_CONVASSERS_DIALOG_OPEN:
            {
                /**
                 * Set flag for canvasser's dialog is opened.
                 */
                stateCopy.rightSideModel.createCanvasserModalIsOpened = action.payload.IsOpen;
                if (!stateCopy.rightSideModel.createCanvasserModalIsOpened) {
                    stateCopy.rightSideModel.editCanvasser = null;
                } //removing edit data
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_TEAM_DIALOG_OPEN:
            {
                /**
                 * Set flag when team dialog is opened.
                 */
                stateCopy.createTeamModalIsOpened = action.payload.IsOpen;
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_EDIT_TEAM_DIALOG_OPEN:
            {
                /**
                 * Set state when team dialog is opened in edit mode to prefilled the teams data like of canvassers and routes.
                 */
                stateCopy.editTeamModalIsOpened = action.payload.IsOpen;
                stateCopy.teamToEdit = action.payload.teamOpened;
                stateCopy.validation.message = action.payload.validationMessage;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_JUMP_TEAM_DIALOG_OPEN:
            {
                /**
                 * Set flag when jump team dialog is opened.
                 */
                stateCopy.jumpTeamModalIsOpened = action.payload.IsOpen;
                stateCopy.teamToEdit = action.payload.teamOpened;
                stateCopy.validation.message = action.payload.validationMessage;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_BOROUGH:
            {
                /**
                 * Set the selected borough and filter sites on selected borough.
                 */
                stateCopy.filterModel.selectedBorough = action.payload.value;
                stateCopy.filterModel.sites.filter((site) => (stateCopy.filterModel.selectedBorough && site.boroughId == stateCopy.filterModel.selectedBorough.boroughId));
                /**
                 * Set initial teams, routes and canvassers to empty array and also the temporary array containg searched canvassers and routes.
                 */
                stateCopy.searchedTeams = [];
                stateCopy.rightSideModel.searchedRoutes = [];
                stateCopy.rightSideModel.searchedCanvassers = [];
                stateCopy.rightSideModel.initialSearchedRoutes = [];
                stateCopy.rightSideModel.initialSearchedCanvassers = [];
                stateCopy.routeCanvasLoaderShown = false;
                stateCopy.panelProperties.panelReload = false;
                stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption = Constants.emptyString;
                stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption = Constants.emptyString;
                /**
                 * Filter the status dropdown on the basis of selected canvassser/route tab.
                 */
                stateCopy.rightSideModel.statusModel.selectedRoutesOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.route && option.value == Constants.defaultSelectedOption))[0];
                stateCopy.rightSideModel.statusModel.selectedCanvOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.canvasser && option.value == Constants.defaultSelectedOption))[0];
                let allSites = stateCopy.filterModel.sites.filter(s => s.siteId != -1 && stateCopy.filterModel.selectedBorough && s.boroughId == stateCopy.filterModel.selectedBorough.boroughId);

                if (allSites && allSites.length == 1) {
                    stateCopy.filterModel.selectedSite = allSites[0];
                    stateCopy.createTeamModel.selectedSite = allSites[0];
                }
                return stateCopy;
            }
        case adminActionTypes.SET_SITE:
            {
                /**
                 * Set site of the filter.
                 */
                stateCopy.filterModel.selectedSite = action.payload.value;
                stateCopy.createTeamModel.selectedSite = action.payload.value;

                if (action.payload.showLoader) {
                    stateCopy.panelProperties.panelReload = true;
                    stateCopy.routeCanvasLoaderShown = true;
                }
                /**
                 * Set initial teams, routes and canvassers to empty array and also the temporary array containg searched canvassers and routes.
                 */
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption = Constants.emptyString;
                stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption = Constants.emptyString;
                stateCopy.rightSideModel.searchedRoutes = [];
                stateCopy.rightSideModel.searchedCanvassers = [];
                stateCopy.rightSideModel.initialSearchedRoutes = [];
                stateCopy.rightSideModel.initialSearchedCanvassers = [];
                /**
                 * Filter the status dropdown on the basis of selected canvassser/route tab.
                 */
                stateCopy.rightSideModel.statusModel.selectedRoutesOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.route && option.value == Constants.defaultSelectedOption))[0];
                stateCopy.rightSideModel.statusModel.selectedCanvOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.canvasser && option.value == Constants.defaultSelectedOption))[0];
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_EXPAND_ADMIN:
            {
                stateCopy.panelProperties.panelExpanded = !stateCopy.panelProperties.panelExpanded;
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_RELOAD_ADMIN:
            {
                stateCopy.panelProperties.panelReload = !stateCopy.panelProperties.panelReload;
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_COLLAPSE_ADMIN:
            {
                stateCopy.panelProperties.panelCollapsed = !stateCopy.panelProperties.panelCollapsed;
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_REMOVE_ADMIN:
            {
                stateCopy.panelProperties.panelRemoved = action.payload;
                return stateCopy;
            }
        case adminActionTypes.CREATE_TEAM_SET_SITE:
            {
                stateCopy.createTeamModel.selectedSite = action.payload.value;
                return stateCopy;
            }
        case adminActionTypes.CREATE_TEAM_SET_BOROUGH:
            {
                stateCopy.createTeamModel.selectedBorough = action.payload.value;
                stateCopy.filterModel.sites.filter((site) => (stateCopy.filterModel.selectedBorough && site.boroughId == stateCopy.filterModel.selectedBorough.boroughId));
                stateCopy.filterModel.sites.sort((a, b) => {
                    return (a.siteName.trim() < b.siteName.trim()
                        ? -1
                        : (a.siteName.trim() > b.siteName.trim()
                            ? 1
                            : 0));
                });
                return stateCopy;
            }
        case adminActionTypes.CREATE_TEAM_SET_BOROUGH_SITE:
            {
                stateCopy.createTeamModel.selectedBorough = action.payload.borough;
                stateCopy.createTeamModel.selectedSite = action.payload.site;
                stateCopy.filterModel.sites.filter((site) => (stateCopy.filterModel.selectedBorough && site.boroughId == stateCopy.filterModel.selectedBorough.boroughId));
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM_MEMBER:
            {
                /**
                 * Removes a canvasser from the team.
                 */
                let teamCurrent = stateCopy.searchedTeams.filter((team, index) => team.id === action.payload.teamId)[0];
                let currentUser = teamCurrent.users.filter((user) => user.id == action.payload.userId)[0];
                teamCurrent.users = teamCurrent.users.filter((user) => user.id !== action.payload.userId);
                let index = stateCopy.searchedTeams.findIndex(team => team.id === action.payload.teamId);
                stateCopy.searchedTeams[index] = teamCurrent;
                stateCopy.teamToEdit = teamCurrent;
                stateCopy.validation.message = Utility.stringFormat(Constants.messages.editTeamModal.memberRemoved, currentUser.name);
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM_ROUTE:
            {
                /**
                 * Removes a route from the team.
                 */
                let teamCurrent = stateCopy.searchedTeams.filter((team, index) => team.id === action.payload.teamId)[0];
                let routeCurrent = teamCurrent.routes.filter((route) => route.id == action.payload.routeId)[0];
                teamCurrent.routes = teamCurrent.routes.filter((route) => route.id !== action.payload.routeId);
                let index = stateCopy.searchedTeams.findIndex(team => team.id === action.payload.teamId);
                stateCopy.searchedTeams[index] = teamCurrent;
                stateCopy.teamToEdit = teamCurrent;
                stateCopy.validation.message = Utility.stringFormat(Constants.messages.editTeamModal.routeRemoved, routeCurrent.name);
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM_ALL_ROUTE:
            {
                /**
                 * Removes all routes from the team.
                 */
                let teamCurrent = stateCopy.searchedTeams.filter((team, index) => team.id === action.payload.teamId)[0];
                teamCurrent.routes.length = 0;
                let index = stateCopy.searchedTeams.findIndex(team => team.id === action.payload.teamId);
                stateCopy.searchedTeams[index] = teamCurrent;
                stateCopy.teamToEdit = teamCurrent;
                stateCopy.validation.message = Constants.messages.editTeamModal.allRoutesRemoved;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SHOW_VALIDATION_MESSAGE:
            {
                if (action.payload.validationMessage === Constants.emptyString) {
                    stateCopy.validation.message = Constants.emptyString;
                    stateCopy.validation.isPopup = false;
                    stateCopy.validation.type = Constants.validation.types.success.key;
                } else {
                    stateCopy.validation.message = action.payload.validationMessage;
                    stateCopy.validation.isPopup = action.payload.isPopup;
                    stateCopy.validation.type = action.payload.type;
                }
                return stateCopy;
            }
        case adminActionTypes.SET_POPUPLOADER_TOGGLE:
            {
                stateCopy.popupLoaderShown = !stateCopy.popupLoaderShown;
                return stateCopy;
            }
        case adminActionTypes.RESET_CREATE_TEAM_MODEL:
            {
                stateCopy.createTeamModel.teamName = Constants.emptyString;
                stateCopy.createTeamModel.selectedSite = null;
                stateCopy.createTeamModel.selectedBorough = null;
                return stateCopy;
            }
        case adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE:
            {
                stateCopy.routeCanvasLoaderShown = action.payload.showCanvRoutLoader;
                stateCopy.panelProperties.panelReload = action.payload.showTeamLoader;
                return stateCopy;
            }
        case adminActionTypes.SET_TEAM_LEADER:
            {
                if (stateCopy.teamToEdit && stateCopy.teamToEdit.users) {

                    stateCopy.teamToEdit.users.forEach((user) => {
                        user.isTeamLeader = (user.id == action.payload.Leader.id).toString();
                    })
                    stateCopy.searchedTeams.forEach(team => {
                        if (team.teamId == stateCopy.teamToEdit.teamId) {
                            team.users.forEach((user) => {
                                user.isTeamLeader = (user.id == action.payload.Leader.id).toString();
                            })
                        }
                    })
                }
                return stateCopy;
            }
        case adminActionTypes.SET_TEAM_NAME:
            {
                stateCopy.createTeamModel.teamName = action.payload.teamName;
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM:
            {
                var Teams = [];
                stateCopy.searchedTeams.forEach(function (team) {
                    if (team.id && action.payload != team.id) {
                        Teams.push(team);
                    }
                });
                stateCopy.searchedTeams = Teams;
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH:
            {
                stateCopy.panelProperties.panelReload = action.payload;
                return stateCopy;
            }
        case adminActionTypes.SET_ADMIN_LAST_UPDATED_ON:
            {
                stateCopy.panelProperties.lastUpdatedOn = Utility.formatAMPM(new Date());
                return stateCopy;
            }
        case adminActionTypes.SET_ROUTE_TYPE:
            {
                stateCopy.teamToEdit.routes.find((route) => (action.payload.routeId === route.id)).routeType = action.payload.routeType.label;
                return stateCopy;
            }
        case adminActionTypes.SET_RIGHT_SIDE_LOADERS:
        {
                stateCopy.panelProperties.panelReload = action.payload;
                stateCopy.routeCanvasLoaderShown = action.payload;
                return stateCopy;
        }
         case adminActionTypes.SET_SELECTED_TEAM_FOR_CONVESSER: 
        {          
            stateCopy.selectedTeamForConvesser = action.payload.value;
            return stateCopy;
        }
        case adminActionTypes.SET_CONVESSER_TYPE: 
        {
            stateCopy.selectedConvesserType = action.payload.value;
            return stateCopy;
        }
        default:
            return state
    }

}