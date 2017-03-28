/**
 * Constants for
 * 1. GraphQL service endpoint
 * 2. GeoJSON URL
 */
export const API_URLs = {
   admin: {
        SERVER_BASE_URL: "https://qcdev.dhsportal.nyc/graphql", //-- for development
        GEO_JSON_URL: 'https://qcdev.dhsportal.nyc/geo/hope-all-small.geojson',
        SURVEY_EXCEL_DOWNLOAD_URL:'https://qcdev.dhsportal.nyc:444/download/survey'
    },
    nonAdmin: {
        SERVER_BASE_URL: "http://hopesf.dhsportal.nyc/graphql", //-- for development
        GEO_JSON_URL: 'http://hopesf.dhsportal.nyc/geo/hope-all-small.geojson',
        SURVEY_EXCEL_DOWNLOAD_URL:'https://hopesf.dhsportal.nyc:444/download/survey'
    }
}

/**
 * Common constants used throughout the application
 */
export const Constants = {
    /**
     * Constants for messages.
     */
    messages: {
        loadingError: "Error occured in loading...",
        loadingMessage: "Loading Please wait...",
        loginMessages: {
            emptyUserNamePassword: "Please provide Username and Password.",
            emptyPassword: "Please provide Password.",
            emptyUserName: "Please provide Username.",
            invalidCredentials: "Invalid Username or Password."
        },
        createTeamModal: {
            invalidTeamName: "Team name is required.",
            invalidTeamBorough: "Team Borough is required.",
            invalidTeamSite: "Team site is required.",
            invalidBoroughAndSite: "Team borough and site are required.",
            invalidSite: "Please select site.",
            teamAdded: "Team \"{0}\" added successfully."
        },
        editTeamModal: {
            memberRemoved: "Member \"{0}\" has been removed from the team.",
            routeRemoved: "Route \"{0}\" has been removed from the team.",
            allRoutesRemoved: "All routes have been removed from the team.",
            routeRemoveConfirm: "Are you sure, you want to remove route \"{0}\" from team \"{1}\" ?",
            memberRemoveConfirm: "Are you sure, you want to remove user \"{0}\" from team \"{1}\" ?",
            allRoutesRemoveConfirm: "Are you sure, you want to remove all routes from team \"{0}\" ?",
            teamRemoveConfirm: `Are you sure, you want to delete team "{0}"?`
        },
        createEditCanvasser: {
            invalidFirstName: "First Name is required.",
            invalidLastName: "Last Name is required.",
            emailRequired: "Email is required.",
            invalidEmail: "Email is invalid.",
            canvasserAdded: "Canvasser \"{0}\" added successfully.",
            canvasserUpdated: "Canvasser \"{0}\" updated successfully.",
            canvasserDeleted: "Canvasser \"{0}\" deleted successfully.",
            canvasserDeleteConfimMsg: "Are you sure, you want to delete canvasser \"{0}\"?",
            canvasserTeamRelationMsg: "Canvasser \"{0}\" is assigned to team \"{1}\"."
        },
        commonMessages: {
            someErrorOccured: "Some error occured!. Please try again.",
            exceptionOnPageLoad: "Error occured while loading data!. <i class='error-message-details'>{0}</i>."
        },
        assignCanvasserToTeam: "Do you want to assign canvasser \"{0}\" to team \"{1}\" ?",
        assignCanvasserToTeamFailure: "Relation b/w canvasser \"{0}\" and team \"{1}\" does not exist.\n Please refresh.",
        routeProgress: {
            routesCompletedInformation: "\"{0}\" of \"{1}\""
        },
        defaultMessageTimeout: 10000,// in milliseconds
        noRecordFound: "No Record Found.",
        noTeamMember: "No team members assigned.",
        noTeamRoute: "No Routes Assigned.",
        selectBoroughSite: "Please select Borough and Site to view team assignments.",
        selectBoroughSiteSF: "Please select Site to view team assignments.",
        noRoutesOnMap:"No Routes to show"
    },
    selectedAdminTab: {
        route: "routes",
        canvasser: "canvassers"
    },
    selectedReportsTab: {
        downloadsurveys:'downloadsurveys'
    },
    defaultSelectedOption: "All",

    /**
     * Constants for drag types
     */
    dragType: {
        canvasser: "Canvasser",
        route: "Route"
    },
    /**
     * Constants for filters types
     */
    filterStatusType: {
        canvasser: "canvasser",
        route: "route"
    },
    /**
     * Constants for graphQL actions
     */
    action: {
        none: "none",
        add: "add",
        update: "update",
        delete: "delete"
    },
    /**
     * Constants for validation messages
     */
    validation: {
        types: {
            success: {
                key: "Success",
                containerCSS: "validation_success",
                icon: "fa fa-check"
            },
            error: {
                key: "Error",
                containerCSS: "validation_error",
                icon: "fa fa-times-circle"
            },
            warning: {
                key: "Warning",
                containerCSS: "validation_warning",
                icon: "fa fa-warning"
            },
            info: {
                key: "Info",
                containerCSS: "validation_info",
                icon: "fa fa-info-circle"
            }
        },
        mainContainerCSS: "validation_container"
    },
    emptyString: "",
    /**
     * Constants for circular progress chart
     */
    circularProgressChart: {
        percent: 'percent',
        maxCircleAngle: 360,
        maxCircleAngleToClamp: 359.9,
        minCircleSectorAngle: 3.6,
        linearGradientKey: 'linearGradient',
        backGroundKey: 'backGround',
        foreGroundKey: 'foreGround',
        percentLabelPositionX: 100,
        percentLabelPositionY: 100,
        percentLabelPositionYProgessLabelHidden: 125,
        progressLabelPositionX: 100,
        progressLabelPositionY: 130,
        startRedColor: 218,
        startBlueColor: 45,
        startGreenColor: 20,
        redColorDilutionValue: 1.99,
        greenColorDilutionValue: 1.59,
        blueColorDilutionValue: 1.45
    },
    colorCodes: {
        inProgressRoutes: "#F09c1c",
        notStartedRoutes: "#ED5959",
        completedRoutes: "#4EABAC"
    },
    teamsNeedingEscorts:'Teams needing NYPD escort:',
    routeStatusKey: {
        inProgress: {
            key: "in_progress",
            value: "In Progress"
        },
        notStarted: {
            key: "not_started",
            value: "Not Started"
        },
        completed: {
            key: "completed",
            value: "Completed"
        },
        unAssigned: {
            key: "unAssigned",
            value: "UnAssigned"
        },
        assigned: {
            key: "assigned",
            value: "assigned"
        }
    },
    canvasserStatus: {
        assigned: {
            key: 'assigned', value: 'Assigned'
        },
        unAssigned: {
            key: 'unAssigned', value: 'UnAssigned'
        }
    },
    pathNames: {
        admin: "admin",
        home: "/",
        login: "login",
        dashboard: [
            "/dashboard", "/dashboard/", "dashboard"
        ],
        reports:'reports',
        canvasser: "canvasser",
        noMatch: "*"
    },
    surveysSubmittedType: {
        all: "all",
        borough: "zone",
        site: "site",
        team: "team"
    },
    dashBoardViewKey: {
        mapView: "mapview",
        listView: "listview",
        dataView: "dataview",
        filterSector: 'filterSector',
        filterRoute: 'filterRoute',
        progressToggle: 'progressToggle',
        keywordsearch: 'keywordsearch'
    },
    reportsViewKeys:{downloadsurveys:'downloadsurveys'},
    "menuCategory":{"admin":"admin","dashboard":"dashboard","reports":"reports"},
    loginUserTypes: {
        admin: "admin",
        sfUser: "sfUser"
    },
    routeTypeOptions: [
        {
            value: 1, label: "Park"
        },
        {
            value: 2, label: "Subway"
        },
        {
            value: 3, label: "Street"
        }
    ],
    routesStatus: {
        in_progress: "in_progress",
        not_started: "not_started",
        completed: "completed"
    },
    routeNeedNYPD:{
        yes: "YES",
        no: "NO",
        true:"true",
        false:"false"
    },
    mapThemes: {
        Theme_1: [
            {
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#242f3e'
                    }
                ]
            }, {
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#242f3e'
                    }
                ]
            }, {
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#746855'
                    }
                ]
            }, {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#d59563'
                    }
                ]
            }, {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#d59563'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#263c3f'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#6b9a76'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#38414e'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#212a37'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#9ca5b3'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#746855'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#1f2835'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#f3d19c'
                    }
                ]
            }, {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#2f3948'
                    }
                ]
            }, {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#d59563'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#17263c'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#515c6d'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#17263c'
                    }
                ]
            }
        ],
        Theme_2: [
            {
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#ebe3cd'
                    }
                ]
            }, {
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#523735'
                    }
                ]
            }, {
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#f5f1e6'
                    }
                ]
            }, {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#c9b2a6'
                    }
                ]
            }, {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#dcd2be'
                    }
                ]
            }, {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#ae9e90'
                    }
                ]
            }, {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#93817c'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [
                    {
                        color: '#a5b076'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#447530'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#f5f1e6'
                    }
                ]
            }, {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#fdfcf8'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#f8c967'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#e9bc62'
                    }
                ]
            }, {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#e98d58'
                    }
                ]
            }, {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#db8555'
                    }
                ]
            }, {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#806b63'
                    }
                ]
            }, {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#8f7d77'
                    }
                ]
            }, {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#ebe3cd'
                    }
                ]
            }, {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [
                    {
                        color: '#b9d3c2'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#92998d'
                    }
                ]
            }
        ]
    }
};
