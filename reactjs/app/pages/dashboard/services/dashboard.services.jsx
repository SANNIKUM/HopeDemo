import {CommonService} from "../../shared/services/common.service";
import {Constants} from "../../../common/app-settings/constants";
/**
 * GraphQL queries for dashboard view.
 */
let DashboardService = {
  /**
   * Get all routes and the sites and teams withtin the route grapQL query.
   */
  getRoutesList: function () {
    var requestPayload = `
                {
                  routes: assignments(type: "route") {
                    id
                    name
                    status: assignmentProperty(type: "route_status")
                    routeType: assignmentProperty(type: "type")
                    station: assignmentProperty(type: "station")
                    sites: altAssignments(type: "site") {
                      id
                      name
                    }
                    teams: altAssignments(type: "team") {
                      id
                      name
                      label
                    }
                  }
                }

            `;
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * Get all boroughs grapQL query.
   */
  getAllBoroughsData: function () {
    var requestPayload = `{
            boroughs: assignments(type: "zone") {
                  id
                  name
                }
            }`;
    return CommonService.sendRequest(requestPayload);
  },
  /**
   * Get all teams grapQL query.
   */
  getAllTeamsData: function () {
    var requestPayload = `{
          teams: assignments(type: "team") {
                id
                name
              }
          }`;
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * get all boroughs grapQL query.
   */
  getAllBoroughs: function () {
    var requestPayload = `{
              boroughs: assignments(type:"zone") {
                id
                name                
              }
            }`;
    return CommonService.sendRequest(requestPayload);
  },
  /**
   * Get all sites for a given borough grapQL query.
   */
  getSitesForSelectedBorough: function (selectedBorough) {
    var requestPayload = `{
              borough: assignment(type: "` + selectedBorough.assignmentType.name + `", id: ` + selectedBorough.id + `) {
                id
                name
                sites: assignments(type: "site") {
                  id
                  name
                }
              }
          }`;
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * Get All sites grapQL query.
   */
  getAllSitesData: function () {
    var requestPayload = `{
                    sites: assignments(type: "site") {
                            id
                            name
                          }
              }`;
    return CommonService.sendRequest(requestPayload);
  },
  /**
   * Get all teams for a given site grapQL query.
   */
  getTeamsForSelectedSite: function (selectedSite) {
    var requestPayload = `{
                      site: assignment(type: "site", id: ` + selectedSite.id + `) {
                            id
                            name
                            teams: assignments(type: "team") {
                              id
                              name
                            }
                          }
                    }`;
    return CommonService.sendRequest(requestPayload);
  },
  /**
   * Get surveys sumiited count by areaName where areaName is in ("all", "zone","site","team")
   * In case of "all", the id parameter is not required.
   */
  getSurveysSubmitted: function (areaName, id,sites) {
    if(areaName  != Constants.surveysSubmittedType.all && areaName  != Constants.surveysSubmittedType.borough){
      var requestPayload = `{
            submittedForms: submittedForms(filterType: "${areaName}", id: ${id})
        }
        `;
      return CommonService.sendRequest(requestPayload);
    }
    else
    {
      // if all borouhs selected then show sum of all sites surveys submitted
      if(sites){
          let requestPayload ="";
          if(areaName  == Constants.surveysSubmittedType.borough)
          {
            sites = sites.filter(m=> m.boroughId == id);
          }
          sites.forEach(m=>{
              requestPayload += m.siteId != -1 ? ("site_"+m.siteId) +":submittedForms(filterType:\"site\",id:"+m.siteId+") " :' ';
          });
          requestPayload = "{ "+ requestPayload +" }"
          return CommonService.sendRequest(requestPayload).then((response)=>{  
              if(response.data){
                let sum=0;
                Object.keys(response.data).forEach(x=>{
                  sum += parseInt(response.data[x]);
                })
                return {data:{submittedForms:sum}};
              }
              else
                return 0;
            })
      }
    }
  },
  /**
 * Get filters data for dashbboard grapQL query.
 */
  getFiltersData: function () {
    var requestPayload = `
        {
          boroughs: assignments(type: "zone") {
            id
            name
            sites: altAssignments(type: "site") {
              id
              name
              teams: altAssignments(type: "team") {
                id
                name
                label
                #lat: assignmentProperty(type: "team_latitude")
                #lon: assignmentProperty(type: "team_longitude")
              }
            }
          }
        }

        `;
    return CommonService.sendRequest(requestPayload);
  },
  /**
   * Get surveys submitted for all teams grapQL query.
   */
  getSurveysSubmittedAllTeams: function (teams) {

    let requestPayload = "";

    teams.forEach((team) => {
      requestPayload += (requestPayload.length > 0 ? ',' : '') + (("team_" + team.teamId + "_b_" + team.boroughId) + ': submittedForms(filterType: "team", id:' + team.teamId + ')');
    });

    requestPayload = "{" + requestPayload + "}";
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * Get surveys submitted for all boroughs grapQL query.
   */
  getSurveysSubmittedAllBoroughs: function (boroughs,allsites) {

    let requestPayload = "";
    /* Temporary Commenting this out , but wil be enabled when dummy method removed from filter component */
    // boroughs.forEach((borough) => {
    //   requestPayload += (requestPayload.length > 0 ? ','  : '') + (("borough_" + borough.boroughId) + ': submittedForms(filterType: "zone", id:' + borough.boroughId + ')');
    // });
     /* Dummy code STARTED  */
       boroughs.forEach((borough) => {
         let singleSIte = allsites.filter(site=> site.boroughId == borough.boroughId && site.siteId != -1)[0];
           requestPayload += (requestPayload.length > 0 ? ','  : '') + (("borough_" + borough.boroughId) + ': submittedForms(filterType: "site", id:' + singleSIte.siteId + ')');
       });

     /* Dummy code END  */
    requestPayload = "{" + requestPayload + "}";
    return CommonService.sendRequest(requestPayload);
  }

};

exports.DashboardService = DashboardService;