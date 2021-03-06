import {dashboardActionTypes} from "../actions/dashboardActionTypes";
import {dashboardState} from "../state/";
import {Utility} from "../../../common/utility/";
import {Constants} from "../../../common/app-settings/constants";
import {CommonService} from "../../shared/services/common.service";
import {AuthorizationRules} from "../../shared/services/authorization.rules";

export default(state = dashboardState, action) => {
    let stateCopy = {};
    /**
     * Create a copy of the state on which actions will be performed.
     */
    if (dashboardActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    /**
     * Set data for routes progress chart.
     */
    function setRoutesProgressChartData() {

        if (stateCopy.rightSideModel.filtersModel.selectedTeam.teamId == -1) {
            if (stateCopy.rightSideModel.filtersModel.selectedSite.siteId == -1) {
                if (stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId == -1) {
                    stateCopy.rightSideModel.totalRoutes = stateCopy.rightSideModel.allRoutes.length;
                    stateCopy.rightSideModel.routesInProgress = stateCopy
                        .rightSideModel.allRoutes.filter((route) => (route.routeStatus === Constants.routesStatus.in_progress)).length;
                    stateCopy.rightSideModel.completedRoutes = stateCopy
                        .rightSideModel.allRoutes.filter((route) => (route.routeStatus === Constants.routesStatus.completed)).length;
                } else {
                    stateCopy.rightSideModel.totalRoutes = stateCopy.rightSideModel.allRoutes.filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId)).length;
                    stateCopy.rightSideModel.routesInProgress = stateCopy.rightSideModel.allRoutes.filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.routeStatus === Constants.routesStatus.in_progress)).length;
                    stateCopy.rightSideModel.completedRoutes = stateCopy.rightSideModel.allRoutes.filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.routeStatus === Constants.routesStatus.completed)).length;
                }

            } else {
                stateCopy.rightSideModel.totalRoutes = stateCopy
                    .rightSideModel
                    .allRoutes
                    .filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.siteId == stateCopy.rightSideModel.filtersModel.selectedSite.siteId))
                    .length;
                stateCopy.rightSideModel.routesInProgress = stateCopy
                    .rightSideModel
                    .allRoutes
                    .filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.siteId == stateCopy.rightSideModel.filtersModel.selectedSite.siteId && route.routeStatus === Constants.routesStatus.in_progress))
                    .length;
                stateCopy.rightSideModel.completedRoutes = stateCopy
                    .rightSideModel
                    .allRoutes
                    .filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.siteId == stateCopy.rightSideModel.filtersModel.selectedSite.siteId && route.routeStatus === Constants.routesStatus.completed))
                    .length;
            }

        } else {
            stateCopy.rightSideModel.totalRoutes = stateCopy.rightSideModel.allRoutes.filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.siteId == stateCopy.rightSideModel.filtersModel.selectedSite.siteId && route.teamId == stateCopy.rightSideModel.filtersModel.selectedTeam.teamId)).length;
            stateCopy.rightSideModel.routesInProgress = stateCopy.rightSideModel.allRoutes.filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.siteId == stateCopy.rightSideModel.filtersModel.selectedSite.siteId && route.teamId == stateCopy.rightSideModel.filtersModel.selectedTeam.teamId && route.routeStatus === Constants.routesStatus.in_progress)).length;
            stateCopy.rightSideModel.completedRoutes = stateCopy.rightSideModel.allRoutes.filter((route) => (route.boroughId == stateCopy.rightSideModel.filtersModel.selectedBorough.boroughId && route.siteId == stateCopy.rightSideModel.filtersModel.selectedSite.siteId && route.teamId == stateCopy.rightSideModel.filtersModel.selectedTeam.teamId && route.routeStatus === Constants.routesStatus.completed)).length;

        }
    }

    switch (action.type) {
        case dashboardActionTypes.SET_ROUTES_DATA:
            {
                /**
                 * Set routes and teams data fetched from graphQL.
                 */
                stateCopy.rightSideModel.routesModel = action.payload;

                stateCopy.rightSideModel.allRoutes = [];

                if (action.payload != null && action.payload.routes != null && action.payload.routes.length > 0) {
                    action.payload.routes
                        .forEach((route, index) => {
                            let routeName = route.name;
                            let routeObj = {
                                routeId: route.id,
                                routeName: routeName,
                                routeStatus: (route.status ? route.status : Constants.routesStatus.not_started),// NULL status as Not_Started
                                routeType: route.routeType,
                                station: route.station,
                                lat: route.lat,
                                lon: route.lon,
                                siteId: -1,
                                siteName: '',
                                teamId: -1,
                                teamName: '',
                                teamLabel: '',
                                boroughId: -1,
                                boroughName: ''
                            }
                            if (route.sites != null && route.sites.length > 0) {
                                routeObj.siteId = route.sites[0].id;
                                routeObj.siteName = route.sites[0].name;
                            }
                            if (route.teams != null && route.teams.length > 0) {
                                routeObj.teamId = route.teams[0].id;
                                routeObj.teamName = route.teams[0].name;
                                routeObj.teamLabel = route.teams[0].label;
                            }
                            stateCopy.rightSideModel.allRoutes.push(routeObj);
                        })

                    if (stateCopy.rightSideModel.allRoutes.length > 0 && stateCopy.rightSideModel != null && stateCopy.rightSideModel.teams != null && stateCopy.rightSideModel.teams.length > 0) {
                        stateCopy.rightSideModel.allRoutes.forEach((route) => {
                                let sSite = stateCopy.rightSideModel.sites.find((site) => (site.siteId == route.siteId))
                                if (sSite != null) {
                                    let sBorough = stateCopy.rightSideModel.boroughs.find((borough) => (borough.boroughId == sSite.boroughId));
                                    if (sBorough != null && sBorough.boroughId != -1) {
                                        route.boroughId = sBorough.boroughId;
                                        route.boroughName = sBorough.boroughName;
                                    }
                                }
                            })
                    }
                }
                /* Set Data after Authorisation START */
                let currentUserSites = AuthorizationRules.getCurrentUserSiteNames();
                if(currentUserSites)
                    stateCopy.rightSideModel.allRoutes = stateCopy.rightSideModel.allRoutes.filter((route)=>currentUserSites.indexOf(route.siteName.toLowerCase().replace(/ /g,''))>-1);

                /* Set Data after Authorisation END */

                setRoutesProgressChartData();

                // reload disabled
                stateCopy.middleFilterModel.panelProperties.panelReload = false;
                return stateCopy;
            }
        case dashboardActionTypes.SET_DASH_BOROUGH:
            {
                /**
                 * Set borough and filter sites and teams for the the selected borough.
                 */
                stateCopy.rightSideModel.filtersModel.selectedBorough = action.payload.value;


                 // select item if there is only one in the list of Borough/Site/Teams               
               
                let allSites =  stateCopy.rightSideModel.sites.filter((site) => (site.siteId != -1) && (action.payload.value.boroughId ==-1 || site.boroughId == action.payload.value.boroughId));
                if(allSites && allSites.length==1){
                    stateCopy.rightSideModel.filtersModel.selectedSite = allSites[0];
                }
                else
                stateCopy.rightSideModel.filtersModel.selectedSite = stateCopy.rightSideModel.sites.find((site) => (site.siteId == -1));

                let allTeams =  stateCopy.rightSideModel.teams.filter((team) => (team.teamId != -1));
                if(allTeams && allTeams.length==1)
                {
                        stateCopy.rightSideModel.filtersModel.selectedTeam = allTeams[0];
                }
                else
                stateCopy.rightSideModel.filtersModel.selectedTeam = stateCopy.rightSideModel.teams.find((team) => (team.teamId == -1));

                /**
                 * Update the route progress chart.
                 */
                setRoutesProgressChartData();

                return stateCopy;
            }
        case dashboardActionTypes.SET_DASH_SITE:
            {
                /**
                 * Set site and filter teams for selected site.
                 */
                stateCopy.rightSideModel.filtersModel.selectedSite = action.payload.value;
               
                let allTeams =  stateCopy.rightSideModel.teams.filter((team) => (team.teamId != -1) && (action.payload.value.siteId==-1 || team.siteId==action.payload.value.siteId));
                if(allTeams && allTeams.length==1)
                {
                        stateCopy.rightSideModel.filtersModel.selectedTeam = allTeams[0];
                    }
                else
                stateCopy.rightSideModel.filtersModel.selectedTeam = stateCopy.rightSideModel.teams.find((team) => (team.teamId == -1));

                /**
                 * Updates routes progress chart.
                 */
                setRoutesProgressChartData();
                return stateCopy;
            }
        case dashboardActionTypes.SET_DASH_TEAM:
            {
                /**
                 * Set team in the filter dropdown.
                 */
                stateCopy.rightSideModel.filtersModel.selectedTeam = action.payload.value;
                /**
                 * Updates routes progress chart.
                 */
                setRoutesProgressChartData();
                return stateCopy;
            }
        case dashboardActionTypes.SET_FILTER_ROUTE:
            {
                /**
                 * Filter routes on selected borough , site ,team and status.
                 */
                stateCopy.middleFilterModel.filterRoutesSelected = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_ROUTE_PROGRESS:
            {
                /**
                 * Set flag for tracing progress of routes.
                 */
                stateCopy.middleFilterModel.routeProgressOn = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_MAP_KEYWORD_SEARCHES:
            {
                /**
                 * set options for keyword search on map.
                 */
                stateCopy.middleFilterModel.searchKeywords.options = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_MAP_KEYWORD_SEARCH:
            {
                stateCopy.middleFilterModel.searchKeywords.selectedOption = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_SURVEYS_SUBMITTED:
            {
                /**
                 * Set surveys submitted for given borough, site, team.
                 */
                stateCopy.rightSideModel.surveysSubmitted = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_FILTERS:
            {
                /**
                 * Set filters for given borough,  site and team.
                 */
                let payload = action.payload;
                stateCopy.rightSideModel.boroughs = [stateCopy.rightSideModel.defaultOptionAll.borough];
                stateCopy.rightSideModel.teams = [stateCopy.rightSideModel.defaultOptionAll.team];
                stateCopy.rightSideModel.sites = [stateCopy.rightSideModel.defaultOptionAll.site];
                if (payload.boroughs != null && payload.boroughs.length > 0) {
                    payload.boroughs.forEach((borough) => {
                        stateCopy.rightSideModel.boroughs.push({
                            boroughId: borough.id,
                            boroughName: borough.name ? borough.name : ''
                        });

                        if (borough.sites != null && borough.sites.length > 0) {

                            borough.sites.forEach((site) => {
                                stateCopy.rightSideModel.sites.push({ boroughId: borough.id, siteId: site.id, siteName: site.name });

                                if (site.teams != null && site.teams.length > 0) {

                                    site.teams.forEach((team) => {
                                        stateCopy.rightSideModel.teams.push({
                                            boroughId: borough.id,
                                            siteId: site.id,
                                            teamId: team.id,
                                            teamName: team.name,
                                            teamLabel: team.label,
                                            lat: team.lat,
                                            lon: team.lon
                                        });
                                    })
                                }
                            })
                        }
                    })
                }

                let currentUserBoroughs = AuthorizationRules.getCurrentUserBoroughNames();
                if(currentUserBoroughs)
                {
                     stateCopy.rightSideModel.boroughs = stateCopy.rightSideModel.boroughs.filter((m)=> currentUserBoroughs.indexOf(m.boroughName.replace(/ /g,'').toLowerCase()) >-1 || m.boroughId == -1);
                }
                let currentUserSites = AuthorizationRules.getCurrentUserSiteNames();
                
                if(currentUserSites)
                {
                     stateCopy.rightSideModel.sites = stateCopy.rightSideModel.sites.filter((m)=> (currentUserSites.indexOf(m.siteName.replace(/ /g,'').toLowerCase()) >-1)  || m.siteId == -1);
                }
                /**
                 * Sort boroughs, teams.
                 */
                stateCopy.rightSideModel.boroughs = stateCopy.rightSideModel.boroughs.sort((a, b) => {
                        return (a.boroughName.trim() < b.boroughName.trim()
                            ? -1
                            : (a.boroughName.trim() > b.boroughName.trim()
                                ? 1
                                : 0));
                    });
                
                stateCopy.rightSideModel.teams.sort(Utility.sortTeamByNameAsc("teamLabel"));

                // select item if there is only one in the list of Borough/Site/Teams
                let allBoroughs = stateCopy.rightSideModel.boroughs.filter(m=>m.boroughId != -1);
                if(allBoroughs && allBoroughs.length == 1){
                    stateCopy.rightSideModel.filtersModel.selectedBorough = allBoroughs[0];
                    stateCopy.rightSideModel.boroughs = stateCopy.rightSideModel.boroughs.filter(m=>m.boroughId != -1);
                }
                else
                    stateCopy.rightSideModel.filtersModel.selectedBorough = stateCopy.rightSideModel.boroughs.find((borough) => (borough.boroughId == -1));
               
               let allSites =  stateCopy.rightSideModel.sites.filter((site) => (site.siteId != -1));
               if(allSites && allSites.length==1){
                 stateCopy.rightSideModel.filtersModel.selectedSite = allSites[0];
                 stateCopy.rightSideModel.sites = stateCopy.rightSideModel.sites.filter((site) => (site.siteId != -1));
               }
               else
                stateCopy.rightSideModel.filtersModel.selectedSite = stateCopy.rightSideModel.sites.find((site) => (site.siteId == -1));

                let allTeams =  stateCopy.rightSideModel.teams.filter((team) => (team.teamId != -1));
               if(allTeams && allTeams.length==1)
               {
                    stateCopy.rightSideModel.filtersModel.selectedTeam = allTeams[0];
                    stateCopy.rightSideModel.teams = stateCopy.rightSideModel.teams.filter((team) => (team.teamId != -1));
                }
               else
                stateCopy.rightSideModel.filtersModel.selectedTeam = stateCopy.rightSideModel.teams.find((team) => (team.teamId == -1));

                return stateCopy;
            }
        case dashboardActionTypes.SET_FILTERS_ON_RELOAD:
            {
                /**
                 * Set filter on relaod.
                 */
                let payload = action.payload;

                stateCopy.rightSideModel.teams = [stateCopy.rightSideModel.defaultOptionAll.team];
                if (payload.boroughs != null && payload.boroughs.length > 0) {

                    payload
                        .boroughs
                        .forEach((borough) => {

                            if (borough.sites != null && borough.sites.length > 0) {

                                borough.sites.forEach((site) => {

                                    if (site.teams != null && site.teams.length > 0) {

                                        site.teams.forEach((team) => {

                                            stateCopy.rightSideModel.teams.push({
                                                boroughId: borough.id,
                                                siteId: site.id,
                                                teamId: team.id,
                                                teamName: team.name,
                                                teamLabel: team.label,
                                                lat: team.lat,
                                                lon: team.lon
                                            });
                                        })
                                    }
                                })
                            }
                        })
                }
                /**
                 * sort data.
                 */
                stateCopy.rightSideModel.teams.sort(Utility.sortTeamByNameAsc("teamLabel"));
                return stateCopy;
            }
        case dashboardActionTypes.SET_MAP_KEYWORD_SEARCH:
            {
                stateCopy.middleFilterModel.searchKeywords.selectedOption = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_PANEL_EXPAND_DASHBOARD:
            {
                stateCopy.middleFilterModel.panelProperties.panelExpanded = !stateCopy.middleFilterModel.panelProperties.panelExpanded;
                return stateCopy;
            }
        case dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD:
            {
                stateCopy.middleFilterModel.panelProperties.panelReload = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_PANEL_COLLAPSE_DASHBOARD:
            {
                stateCopy.middleFilterModel.panelProperties.panelCollapsed = !stateCopy.middleFilterModel.panelProperties.panelCollapsed;
                return stateCopy;
            }
        case dashboardActionTypes.SET_PANEL_REMOVE_DASHBOARD:
            {
                stateCopy.middleFilterModel.panelProperties.panelRemoved = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_MAP_LAST_UPDATED_ON:
            {
                stateCopy.middleFilterModel.panelProperties.lastUpdatedOn = Utility.formatAMPM(new Date());
                return stateCopy;
            }
        case dashboardActionTypes.SET_SURVEYS_TEAMS:
            {
                stateCopy.middleFilterModel.dataViewData.teamsSurveys = action.payload.data;
                return stateCopy;
            }
        case dashboardActionTypes.SET_SURVEYS_BOROUGHS:
            {
                stateCopy.middleFilterModel.dataViewData.boroughsSurveys = action.payload.data;
                return stateCopy;
            }
        case dashboardActionTypes.SET_DASHBOARD_ERROR_MESSAGE:
            {
                stateCopy.validation.message = action.payload.message;
                stateCopy.validation.type = action.payload.type;
                return stateCopy;
            }
        case dashboardActionTypes.SET_LOG_OUT:
            {
                return dashboardState; // Reset to Original State after Logout
            }
        case dashboardActionTypes.SET_MAP_JSON_LOADED:
            {
                stateCopy.middleFilterModel.panelProperties.geoJSONLoaded = action.payload;
                return stateCopy;
            }
        case dashboardActionTypes.SET_MAP_NO_ROUTES_FOUND:
            {
                stateCopy.middleFilterModel.panelProperties.mapNoRoutesFound = action.payload;
                return stateCopy;
            }
        default:
            return state
    }

}