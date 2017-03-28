import {API_URLs, Constants} from "../../../common/app-settings/constants";
import {CustomMarker} from "../components/controls/google-map-custom-marker/";
import {MapLabel} from "../components/controls/custom-map-label-control/";
import { Utility } from "../../../common/utility";
import { CommonService } from "../../shared/services/common.service";

let DashboardMapService = {
    selectedBorough: null,
    selectedSite: null,
    selectedSector: null,
    centerPoints: {
        lat: 40.651410,
        lng: -73.935500
    },
    bounds:null,
    initMap: function (callbackFunction) {
        google.maps.visualRefresh = true;

        let position = new google.maps.LatLng(DashboardMapService.centerPoints.lat, DashboardMapService.centerPoints.lng);
        var mapDiv = document.getElementById('mapviewBody');
        window.dashboardMap = new google.maps.Map(mapDiv, {
                center: position,
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: Constants.mapThemes.Theme_2,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                scaleControl: false,
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                }
            });
            
        let loginDetails = CommonService.getRoleSettings();
        if(loginDetails){
            CommonService.getGeoJSON(CommonService.getRoleSettings().GEO_JSON_URL).then((response)=>{
                window.dashboardMap.data.addGeoJson(response);
                // call back function when json loaded
                callbackFunction();
            })
        }
        // make transparent all layers
        window.dashboardMap.data.setStyle({fillColor: "#fff", fillOpacity: '0', strokeWeight: 0, visible: false});
        DashboardMapService.registerInfoWindow();
        window.onresize = DashboardMapService.resizeMap;
        window.mapLabels = [];
    },
    resizeMap: function () {
        google.maps.event.trigger(window.dashboardMap, "resize");
    },
    registerInfoWindow: function () {
        // When the user clicks, open an infowindow
        var infowindow = new google.maps.InfoWindow();
        var featureId = 0;
        if (window.dashboardMap) {
            window.dashboardMap.data.addListener('click', function (event) {

                    let name = event.feature.getProperty("Name");
                    let zone = event.feature.getProperty("zone");
                    let routeType = event.feature.getGeometry().getType(); // Point == Subway Icon
                    if(routeType=="Point"){
                        name += ": "+ event.feature.getProperty("stationName");
                    }
                    let toolTip = "<table class='route-tooltip-map'><tr><td><b>Route:</b></td><td>" + name + "</td></tr>"+(!CommonService.isSFOUser() ?"<tr><td><b>Borough:&nbsp;</b></td><td>" + zone + "</td></tr>":'')+"</table>";

                    infowindow.setContent(toolTip);
                    infowindow.setPosition(event.latlng);
                    infowindow.setOptions({
                        pixelOffset: new google.maps.Size(0, -30)
                    });
                    var anchor = new google.maps.MVCObject();
                    anchor.setValues({
                        position: event.latLng,
                        anchorPoint: (routeType=="Point" ? new google.maps.Point(0, 0) : new google.maps.Point(0, 40))
                    });

                    infowindow.open(window.dashboardMap, anchor);

                });

            google.maps.event.addListener(window.dashboardMap, 'click', function () {
                    infowindow.close();
                });
        }
    },
    getRouteNames: function (routes, salectedCategory,filterBoroughName) {
        if (routes && routes.length) {
            // returns comma separated routes names
            let routesNames = [];

            routes.forEach((obj, index) => {
                if (obj.routeStatus == salectedCategory.key && (filterBoroughName == '' || obj.boroughName.replace(/ /g,"").toLowerCase() == filterBoroughName.replace(/ /g,"").toLowerCase())) {
                    routesNames.push(obj.routeName.toLowerCase());
                }
            });
            return routesNames;
        } else 
            return [];
        }
    ,
    getValidSiteBoroughNames: function (runObject) {
        let name = "";
        if (runObject && runObject.boroughName) {
            name = runObject.boroughName.trim().replace('All', '');
        }
        return name;
    },
    setMapCenter:function(feature){
        DashboardMapService.processPoints(feature.getGeometry(), DashboardMapService.bounds.extend, DashboardMapService.bounds);
        window.dashboardMap.setCenter(DashboardMapService.bounds.getCenter());
        window.dashboardMap.fitBounds(DashboardMapService.bounds);            
    },
    processPoints:function(geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function(g) {
                    DashboardMapService.processPoints(g, callback, thisArg);
                });
            }
    },
    showLayers: function (filterObject, showAll, allStatus) {
        let boroughName = "";
        
        if (filterObject.selectedBorough) {
            boroughName = filterObject.selectedBorough.boroughName || "";
            if (boroughName == Constants.defaultSelectedOption) {
                boroughName = "";
            }
            boroughName = boroughName.replace(/ /g,'').toLowerCase();
        }
        // set currently focued area
        DashboardMapService.selectedBorough = filterObject.selectedBorough;
        DashboardMapService.bounds = new google.maps.LatLngBounds();
        let transparentRoute = {
            fillOpacity: 0,
            strokeWeight: 0,
            visible: false
        };

        if (!showAll) { // all colours

            if (filterObject.routes.length) {
                if(window.dashboardMap && window.dashboardMap.data)
                    window.dashboardMap.data.setStyle((feature) => {
                            let name = feature.getProperty('Name').toLowerCase(),color = "",featureBorough = feature.getProperty('zone').toLowerCase().replace("_",'').replace(/ /g,"");
                            if (featureBorough === boroughName || boroughName === "") {
                                let routeNames = DashboardMapService.getRouteNames(filterObject.routes, filterObject.selectedStatus,featureBorough);
                                if (routeNames.indexOf(name) > -1) {
                                        DashboardMapService.setMapCenter(feature);
                                        if(feature.getGeometry().getType()=="Point"){
                                            let subwayIcon = require("../../../assets/img/train_marker_" + filterObject.selectedStatus.key.toLowerCase() + ".svg");
                                            return {fillColor: filterObject.selectedStatus.layerColor, strokeWeight: 1, strokeColor: '#444', fillOpacity: 0.6, visible: true,icon:subwayIcon};
                                        }
                                        else
                                            return {fillColor: filterObject.selectedStatus.layerColor, strokeWeight: 1, strokeColor: '#444', fillOpacity: 0.6, visible: true}
                                } else {
                                    return transparentRoute;
                                }
                            } else {
                                // make transparent
                                return transparentRoute;
                            }
                        });
            } else {
                // hide all
                if(window.dashboardMap.data)
                    window.dashboardMap.data.setStyle((feature) => {
                            return transparentRoute;
                        });
            }
        } else if (showAll) {


            if (filterObject.routes.length && window.dashboardMap && window.dashboardMap.data) {

                     //completed layer
                      let statusC = allStatus.filter((obj, index) => obj.key.indexOf(Constants.routeStatusKey.completed.key) >= 0)[0]; 
                     // not started
                      let statusNS = allStatus.filter((obj, index) => obj.key.indexOf(Constants.routeStatusKey.notStarted.key) >= 0)[0];
                     // in progress
                      let statusIP = allStatus.filter((obj, index) => obj.key.indexOf(Constants.routeStatusKey.inProgress.key) >= 0)[0];

                    window.dashboardMap.data.setStyle((feature) => {

                        let name = feature.getProperty('Name').toLowerCase(),color = "",featureBorough = feature.getProperty('zone').replace("_",'').replace(/ /g,'').toLowerCase();
                       
                        if (featureBorough === boroughName || boroughName === "") {                            
                            
                            let routeNamesC = DashboardMapService.getRouteNames(filterObject.routes, statusC,featureBorough);
                            let routeNamesNS = DashboardMapService.getRouteNames(filterObject.routes, statusNS,featureBorough);
                            let routeNamesIP = DashboardMapService.getRouteNames(filterObject.routes, statusIP,featureBorough);
                            
                            let routeStatus = "";
                            if (routeNamesC.indexOf(name) > -1) {
                                color = statusC.layerColor;
                                routeStatus = Constants.routesStatus.completed;
                            } else if (routeNamesNS.indexOf(name) > -1) {
                                color = statusNS.layerColor;
                                routeStatus = Constants.routesStatus.not_started;
                            } else if (routeNamesIP.indexOf(name) > -1) {
                                color = statusIP.layerColor;
                                routeStatus = Constants.routesStatus.in_progress;
                            }
                            
                            if (color.length) {
                                DashboardMapService.setMapCenter(feature);
                                if(feature.getGeometry().getType()=="Point"){
                                    let subwayIcon = require("../../../assets/img/train_marker_" + routeStatus.toLowerCase() + ".svg");
                                    return {fillColor: color, strokeWeight: 1, strokeColor: '#444', fillOpacity: 0.6, visible: true,icon:subwayIcon};
                                }
                                else 
                                    return {fillColor: color, strokeWeight: 1, strokeColor: '#444', fillOpacity: 0.6, visible: true};
                            } else {
                                return transparentRoute;
                            }

                        } else {
                            // make transparent
                            return transparentRoute;
                        }
                    });

            } else {
                if(window.dashboardMap && window.dashboardMap.data)
                     window.dashboardMap.data.setStyle((feature) => {
                        return transparentRoute;
                         });
            }
        }
    },
    getTeamNumber(teamName) {
        let no = "";
        if (teamName) {
            let items = teamName.split('_');
            if (items.length == 2) {
                if (parseInt(items[items.length - 1])) {
                    no = parseInt(items[items.length - 1]);
                } else 
                    no = "NA";
                }
            }
        return no;
    },
    showTeamMarkers(teams) {
        if (teams) {

            // remove all old markers
            if (window.dashboardTeamMarkers && window.dashboardTeamMarkers.length) {
                window.dashboardTeamMarkers.forEach((marker, index) => {
                        marker.remove();
                    })
                window.dashboardTeamMarkers.length = 0;
            }
            
            let markers = [];
            teams.filter(m=>m.teamId != -1 && m.lat && m.lon).forEach((team, index) => {

                let contentString = '<div class="infowindow-team"><b>Team: </b> <span>' + team.teamLabel + "</span></div>";

                let infowindow = new google.maps.InfoWindow({content: contentString});

                let marker = new CustomMarker(new google.maps.LatLng(team.lat, team.lon), window.dashboardMap, {
                    marker_id: "team-marker-" + team.teamid,
                    className: "team-markers-list",
                    content: '<div class="team-icon-map-outer-1"><div class="team-icon-map-inner-1">&nbsp;</div><div class="team-icon-map-inner-2">' + DashboardMapService.getTeamNumber(team.teamName) + '</div></div>'
                });

                marker.addListener('click', (e) => {
                    infowindow.open(window.dashboardMap, marker);
                });
                markers.push(marker);

            })

            window.dashboardTeamMarkers = markers;

        }

    }

};

exports.DashboardMapService = DashboardMapService;
