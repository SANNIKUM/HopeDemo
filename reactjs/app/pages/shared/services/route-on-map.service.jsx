import {API_URLs, Constants} from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility";
import { CommonService } from "../../shared/services/common.service";

let RoutesOnMapPopupService = {
    centerPoints: {
        lat: 40.651410,
        lng: -73.935500
    },
    bounds:null,
    initRouteMap: function (callbackFunction) {
        google.maps.visualRefresh = true;

        let position = new google.maps.LatLng(RoutesOnMapPopupService.centerPoints.lat, RoutesOnMapPopupService.centerPoints.lng);
        var mapDiv = document.getElementById('routeOnMapBody');
        window.routeOnMap = new google.maps.Map(mapDiv, {
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
                window.routeOnMap.data.addGeoJson(response);
                // call back function when json loaded
                callbackFunction();
            })
        }
        // make transparent all layers
        window.routeOnMap.data.setStyle({fillColor: "#fff", fillOpacity: '0', strokeWeight: 0, visible: false});
        RoutesOnMapPopupService.registerInfoWindow();
        window.onresize = RoutesOnMapPopupService.resizeMap;
        window.mapLabels = [];
    },
    resizeMap: function () {
        google.maps.event.trigger(window.routeOnMap, "resize");
    },
    registerInfoWindow: function () {
        // When the user clicks, open an infowindow
        var infowindow = new google.maps.InfoWindow();
        var featureId = 0;
        if (window.routeOnMap) {
            window.routeOnMap.data.addListener('click', function (event) {

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

                    infowindow.open(window.routeOnMap, anchor);

                });

            google.maps.event.addListener(window.routeOnMap, 'click', function () {
                    infowindow.close();
                });
        }
    },
    getValidSiteBoroughNames: function (runObject) {
        let name = "";
        if (runObject && runObject.boroughName) {
            name = runObject.boroughName.trim().replace('All', '');
        }
        return name;
    },
    setMapCenter:function(feature){
        RoutesOnMapPopupService.processPoints(feature.getGeometry(), RoutesOnMapPopupService.bounds.extend, RoutesOnMapPopupService.bounds);
        window.routeOnMap.setCenter(RoutesOnMapPopupService.bounds.getCenter());
        window.routeOnMap.fitBounds(RoutesOnMapPopupService.bounds);            
    },
    processPoints:function(geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function(g) {
                    RoutesOnMapPopupService.processPoints(g, callback, thisArg);
                });
            }
    },
    showLayers: function (routeObject,allStatuses) {
        
        let boroughName = RoutesOnMapPopupService.getValidSiteBoroughNames(routeObject).toLowerCase().replace(/ /g,"");
        let routeName = routeObject.routeName.toLowerCase().replace(/ /g,"");
        let routeStatusObject = allStatuses.filter(m=>m.key.toLowerCase().replace(/ /g,"") == routeObject.routeStatus.toLowerCase().replace(/ /g,""))[0];

        // set currently focued area
        RoutesOnMapPopupService.bounds = new google.maps.LatLngBounds();
        let transparentRoute = {
            fillOpacity: 0,
            strokeWeight: 0,
            visible: false
        };

            if (routeName && routeStatusObject) {
                if(window.routeOnMap && window.routeOnMap.data)
                    window.routeOnMap.data.setStyle((feature) => {
                            let name = feature.getProperty('Name').toLowerCase(),color = "",featureBorough = feature.getProperty('zone').toLowerCase().replace("_",'').replace(/ /g,"");
                            if (featureBorough === boroughName && name == routeName) {
                                RoutesOnMapPopupService.setMapCenter(feature);
                                if(feature.getGeometry().getType()=="Point"){
                                    let subwayIcon = require("../../../assets/img/train_marker_" + routeObject.routeStatus.toLowerCase() + ".svg");
                                    return {fillColor: routeStatusObject.layerColor, strokeWeight: 1, strokeColor: '#444', fillOpacity: 0.6, visible: true,icon:subwayIcon};
                                }
                                else
                                    return {fillColor: routeStatusObject.layerColor, strokeWeight: 1, strokeColor: '#444', fillOpacity: 0.6, visible: true}
                               
                            } else {
                                // make transparent
                                return transparentRoute;
                            }
                        });
            } else {
                // hide all
                if(window.routeOnMap.data)
                    window.routeOnMap.data.setStyle((feature) => {
                            return transparentRoute;
                        });
            }
    }

};

exports.RoutesOnMapPopupService = RoutesOnMapPopupService;
