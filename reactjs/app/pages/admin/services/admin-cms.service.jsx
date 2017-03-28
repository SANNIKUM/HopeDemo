import { CommonService } from "../../shared/services/common.service";
/**
 * GraphQL quesries to be send as POST in the body of the request.
 */
let AdminCMSService = {
  /**
   * Add team grapQL query.
   */
  addTeam: function (teamName) {
    let requestPayload = `
    mutation AddTeam {
    createAssignment(assignment: {name:  ${ "\"" + teamName + "\""}, label:  ${"\"" + teamName + "\""}, type: "team"}) {
      id
      name
    }
  }
    `;
    return CommonService.sendRequest(requestPayload);
  },
  /**
  * remove team grapQL query.
  */
  removeTeam: function (teamId) {
    let requestPayload = `
    mutation DestroyTeam {
      destroyAssignment(assignmentId:${teamId})
    }
    `;
    return CommonService.sendRequest(requestPayload);
  },

  /**
 * Assign relarionship between team and site grapQL query.
 */
  assignRelationTeamToSite: function (siteId, teamId) {
    let requestPayload = `
    mutation AssignRelationTeamToSite {
    createAssignmentRelation(parentAssignmentId: ${siteId}, childAssignmentId:${teamId}) {
      id
      assignment1Id
      assignment2Id
      assignmentRelationTypeId
    }
  }
    `;
    return CommonService.sendRequest(requestPayload);
  },

  /**
 * Destroy relation of canvasser from team.
 */
  destroyRelationCanvasserToTeam: function (destroyRelationFromTeamId, assigneeId) {
    let requestPayload = `
    mutation AssignRelationToTeam {
      destroyAssignmentRelation(parentAssignmentId: ${destroyRelationFromTeamId}, childAssignmentId: ${assigneeId})
    }
    `;
    return CommonService.sendRequest(requestPayload);
  },
  /**
   * Assign relationship between canvasser and team grapQL query.
   */
  assignRelationCanvasserToTeam: function (createRelationWithTeamId, assigneeId) {
    let requestPayload = `
    mutation AssignRelationToTeam {
      createAssignmentRelation(parentAssignmentId: ${createRelationWithTeamId}, childAssignmentId: ${assigneeId}) {
        id
        assignment1Id
        assignment2Id
        assignmentRelationTypeId
      }
    }
    `;
    return CommonService.sendRequest(requestPayload);
  },

  /**
 * Assign relation between route and team grapQL query.
 */
  assignRelationRouteToTeam: function (destroyRelationFromTeamId, createRelationWithTeamId, assigneeId) {
    let requestPayload;
    if (destroyRelationFromTeamId != -1) {
      requestPayload = `
    mutation AssignRelationToTeam {
      destroyAssignmentRelation(parentAssignmentId: ${assigneeId}, childAssignmentId: ${destroyRelationFromTeamId})
      createAssignmentRelation(parentAssignmentId: ${assigneeId}, childAssignmentId: ${createRelationWithTeamId}) {
        id
        assignment1Id
        assignment2Id
        assignmentRelationTypeId
      }
    }
    `
    } else {
      requestPayload = `
    mutation AssignRelationToTeam {
      createAssignmentRelation(parentAssignmentId: ${assigneeId}, childAssignmentId: ${createRelationWithTeamId}) {
        id
        assignment1Id
        assignment2Id
        assignmentRelationTypeId
      }
    }
    `
    };
    return CommonService.sendRequest(requestPayload);
  },

  /**
 * Remove relation between assignments grapQL query.
 */
  destroyRelationFrom: function (fromId, assigneeId) {
    let requestPayload = `
    mutation DestroyRelationFromTeam {
      destroyAssignmentRelation(parentAssignmentId: ${fromId}, childAssignmentId: ${assigneeId})
      updateAssignment(id:${fromId}, update:{
                      properties:[
                        {
                          type:"isTeamLeader",
                          newValue: "false"
                        }
                      ]
                    }){                    
                      id
                      isTeamLeader0:assignmentProperty(type:"isTeamLeader")
                    }
    }
    `;
    return CommonService.sendRequest(requestPayload);
  },
  /**
 * Removes relation of allIds from fromId grapQL query.
 */
  destroyRelationOfAllFrom: function (fromId, allIds) {
    let str = "";

    for (let index = 0; index < allIds.length; index++) {
      str += "destroy" + index + ":destroyAssignmentRelation(parentAssignmentId: " + allIds[index] + ", childAssignmentId: " + fromId + ") ";
    }
    let requestPayload = "\
    mutation destroyAllAssignments{\
      " + str + "\
    }\
    ";
    return CommonService.sendRequest(requestPayload);
  },
  /**
 * Adds canvasser grapQL query.
 */
  addCanvasser: function (newCanvasser) {
    let firstName = newCanvasser.firstName;
    let lastName = newCanvasser.lastName;
    let email = newCanvasser.email;
    let name = firstName + " " + lastName;
    let requestPayload = `
          mutation AddCanvasser {
          createAssignment(assignment: 
            {
              name: ${ "\"" + name + "\""}, 
              label: "Canvasser", 
              type: "user", 
              properties: [
                {type: "firstName", value: ${ "\"" + firstName + "\""}}, 
                {type: "lastName", value: ${ "\"" + lastName + "\""}},
                {type: "email", value: ${ "\"" + email + "\""}}
              ]}
          ) 
          {
            id
          }
        }`;
    return CommonService.sendRequest(requestPayload);
  },
  /**
   * Update canvasser grapQL query.
   */
  updateCanvasser: function (canvasser) {
    let firstName = canvasser.firstName;
    let lastName = canvasser.lastName;
    let email = canvasser.email;
    let name = firstName + " " + lastName;
    let requestPayload = `mutation UpdateCanvasser {
                                    updateAssignment(id:${canvasser.id} update: { name: \"${canvasser.firstName}\", 
                                      properties: [
                                                    {type: "lastName", newValue: \"${lastName}\"}, 
                                                    {type: "firstName", newValue: \"${firstName}\"},
                                                    {type: "email", newValue: \"${email}\"}
                                                  ]}) {
                                      id
                                    }
                                  }
                                  `;
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * Delete Canvasser
   */
  deleteCanvasser: function (canvasser) {
    let requestPayload = `mutation DeleteCanvasser {
                                    destroyAssignment(assignmentId:${canvasser.id})
                                  }
                                  `;
    return CommonService.sendRequest(requestPayload);
  },
  /**
 * Adds relation between site and canvasser grapQL query.
 */
  updateCanvasserSiteRelation: function (canvasserId, siteId) {
    let requestPayload = `
      mutation UpdateRelationSiteAndUser {
        createAssignmentRelation(
          parentAssignmentId: ${siteId}
          childAssignmentId: ${canvasserId} 
          ) {
          id
          assignment1Id
          assignment2Id
          assignmentRelationTypeId
        }
      }
    `;
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * Get all canvassers for a give site Id grapQL query.
   */
  getUsers: function (id) {
    var requestPayload = `{
                    site: assignment(type: "site", id: ${id}){
                      users: altAssignments(type: "user") {
                        id
                        name
                        email: assignmentProperty(type:"email")
                        firstName: assignmentProperty(type:"firstName")
                        lastName: assignmentProperty(type:"lastName")	                    
                        teams: altAssignments(type: "team") {
                          id
                          name
                          label
                        }
                      }
                    }
                  }`;
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * Get All team grapQL query.
   */
  getTeams: function (body) {
    var requestPayload = `{
                assignments(type:"team") {
                  assignmentType {
                    name
                  }
                  name
                  assignmentProperties {
                    assignmentPropertyType {
                      name
                    }
                    value
                  }
                }
              }`;

    return CommonService.sendRequest(requestPayload);

  },
  /**
   * Get all boroughs and sites grapQL query.
   */
  getBoroughsAndSites: function () {
    var requestPayload = `{
            boroughs: assignments(type: "zone") {
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
 * Get All boroughs grapQL query.
 */
  getAllBoroughs: function () {
    var requestPayload = `{
                              boroughs: assignments(type:"zone") {
                                id
                                name
                                assignmentType {
                                  id
                                  name
                                }
                                
                              }
                            }`;
    return CommonService.sendRequest(requestPayload);
  },
  /**
 * Get teams for selected site grapQL query.
 */
  getTeamsForSelectedSite: function (selectedSite) {
    var requestPayload = `
                      {
                        site: assignment(type: "site", id: ` + selectedSite.siteId + `) {
                          teams: altAssignments(type: "team") {
                            id
                            name                            
                            label
                            users: altAssignments(type: "user") {
                              id
                              name 
                              email: assignmentProperty(type:"email")
                              firstName: assignmentProperty(type:"firstName")
                              lastName: assignmentProperty(type:"lastName")	 
                              isTeamLeader : assignmentProperty(type:"isTeamLeader")                          
                            }
                            routes: altAssignments(type: "route") {
                              id
                              name
                              routeType: assignmentProperty(type: "type")
                              station: assignmentProperty(type: "station")
                              routeStatus: assignmentProperty(type: "route_status")
                              routeName: name
                              needNypd : assignmentProperty(type: "needs_nypd")
                            }
                          }
                        }
                      }
    `;
    return CommonService.sendRequest(requestPayload);
  },
  /**
 * Get sites for selected borough grapQL query.
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
 * Get all users and routes in a given team with given teamId grapQL query.
 */
  getUsersRoutesByTeam: function (teamid) {
    var requestPayload = `{
                            team: assignment(type: "team", id: ${teamid}) {
                              users: altAssignments(type: "user") {
                                id
                                name
                              }
                              routes: altAssignments(type: "route") {
                                id
                                name
                                routeType: assignmentProperty(type: "type")
                                station: assignmentProperty(type: "station")
                                #lat: assignmentProperty(type: "latitude")
                                #lon: assignmentProperty(type: "longitude")
                                routeName: name
                                needNypd : assignmentProperty(type: "needs_nypd")
                              }
                            }
                          }
                          `;

    return CommonService.sendRequest(requestPayload);

  },

  /**
   * Get routes for a given site grapQL query.
   */
  getRoutesBySite: function (siteId) {
    var requestPayload = `{
                  site: assignment(type: "site", id: ${siteId}) {
                  id
                  name
                  routes: altAssignments(type: "route") {
                    id
                    name
                    routeStatus: assignmentProperty(type: "route_status")
                    routeType: assignmentProperty(type: "type")
                    station: assignmentProperty(type: "station")
                    #lat: assignmentProperty(type: "latitude")
                    #lon: assignmentProperty(type: "longitude")
                    routeName:name
                    needNypd : assignmentProperty(type: "needs_nypd")
                    teams: altAssignments(type: "team") {
                      id
                      name
                    }
                  }
                }
              }
        `;
    return CommonService.sendRequest(requestPayload);
  },

  /**
   * Get all routes and teams grapQL query.
   */
  getRoutes: function () {
    var requestPayload = `{
                  routes: assignments(type: "route") {
                    id
                    name
                    routeType: assignmentProperty(type: "type")
                    station: assignmentProperty(type: "station")
                    #lat: assignmentProperty(type: "latitude")
                    #lon: assignmentProperty(type: "longitude")
                    routeName: name
                    needNypd : assignmentProperty(type: "needs_nypd")                    
                    teams: assignments(type: "team") {
                      id
                      name
                    }
                  }
                }
         `;

    return CommonService.sendRequest(requestPayload);

  },
  updateRouteType: function (routeId, routeType) {
    let requestPayload = `
    mutation UpdateRouteType{
      updateAssignment(id: ${routeId}, update: {
      properties: [
        {
          type:"type"
          newValue: \"${routeType}\"
        }
      ]
    }){
      id
      routeType: assignmentProperty(type: "type")
    }
  }
    `;
    return CommonService.sendRequest(requestPayload);

  },
  /**
   * set team leader.
   */
  setLeader: function (newLeaderId, oldLeaderIds) {
    let requestData = `
                    a0: updateAssignment(id:${newLeaderId}, update:{
                      properties:[
                        {
                          type:"isTeamLeader",
                          newValue: "true"
                        }
                      ]
                    })
                    {                    
                      id
                      isTeamLeader0:assignmentProperty(type:"isTeamLeader")
                    }`;

    oldLeaderIds.forEach((id, index) => {
      requestData = requestData + `a${index + 1}: updateAssignment(id:${id}, update:{
                      properties:[
                        {
                          type:"isTeamLeader",
                          newValue: "false"
                          
                        }
                      ]
                    })
                    {   
                      id
                      isTeamLeader${index + 1}:assignmentProperty(type:"isTeamLeader")
                    }`
    })
    let requestPayload = `mutation UpdateCanvasser{   ${requestData} } `;

    return CommonService.sendRequest(requestPayload);
  }
};

exports.AdminCMSService = AdminCMSService;