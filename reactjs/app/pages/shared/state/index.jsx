import { Constants } from "../../../common/app-settings/constants"
import { Users } from "./users";

// shared state for all components
export
    const
    sharedState = {
        "leftMenuExpaned": true,
        "isRightPanelExpanded": true,
        "smallScreenLeftMenuOpened":false,
        "smallScreenRightMenuOpened":false,
        "routesOnMap": {
            isOpened : false,
            popupLoaderShown:false,
            routeObject:null
        },
        filterRoutesStatuses:[{
            "value": 3,
            "label": "Not Started",
            "layerColor": "#ff0000",
            "key": "not_started",
            "opacity": 0.88
        },
        {
            "value": 2,
            "label": "In Progress",
            "layerColor": "#f7b047",
            "key": "in_progress"
        },
        {
            "value": 4,
            "label": "Completed",
            "layerColor": "#01ABAB",
            "key": "completed"
        }],
        "menuPanels": [
            {
                "text": "Dashboard",
                "value": Constants.menuCategory.dashboard,
                "isOpened": false,
                "iconClass": "fa fa-television"
            },
            {
                "text": "Admin",
                "value":Constants.menuCategory.admin,
                "isOpened": false,
                "iconClass": "fa fa-user"
            },
            {
                "text": "Reports",
                "value": Constants.menuCategory.reports,
                "isOpened": false,
                "iconClass": "fa fa-bar-chart"
            }
        ],
        "profileMenu": {
            "isOpened": false
        },
        "tabs": [
            {
                "key": "mapview",
                "text": "Map View",
                "isSelected": true,
                "category": Constants.menuCategory.dashboard
            },
            {
                "key": "listview",
                "text": "List View",
                "isSelected": false,
                "category": Constants.menuCategory.dashboard
            },
            {
                "key": "dataview",
                "text": "Data View",
                "isSelected": false,
                "category": Constants.menuCategory.dashboard
            },
            {
                "key": "canvassers",
                "text": "Canvassers",
                "isSelected": true,
                "category": Constants.menuCategory.admin
            },
            {
                "key": "routes",
                "text": "Routes",
                "isSelected": false,
                "category": Constants.menuCategory.admin
            },
            {
                "key": "downloadsurveys",
                "text": "Download Surveys",
                "isSelected": false,
                "category": Constants.menuCategory.reports
            }
        ],
        "loginDetails": {
            "userName": "",
            "password": "",
            "errorMessage": "",
            "rememberMe": false,
            "displayName": "",
            "isloggedIn": false,
            "userId":null,
            "users": Users
        }
    };