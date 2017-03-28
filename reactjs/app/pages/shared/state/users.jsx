import { Constants } from "../../../common/app-settings/constants"

// List of Authenticated Users 
export const Users = [
                {   
                    userId:1,
                    userName: "commandcenter",
                    password: "Work@dhs1!",
                    roles: [Constants.loginUserTypes.admin],
                    displayName: "Command Center",                    
                    isSFOUser: false,
                },
                {   
                    userId:2,
                    userName: "commandcenter",
                    password: "sfcount!",
                    roles: [Constants.loginUserTypes.sfUser],
                    displayName: "SF-Command Center",                    
                    isSFOUser: true,
                },
                {   
                    userId:3,
                    userName: "commandcenter",
                    password: "sf2count!",
                    roles: [Constants.loginUserTypes.sfUser],
                    displayName: "SF 2 -Command Center",                    
                    isSFOUser: true,
                },
                {   
                    userId:4,
                    userName: "dclaguardia",
                    password: "dc@laguardia",
                    roles: [Constants.loginUserTypes.admin],
                    displayName: "La Guardia - Command Center",                    
                    isSFOUser: false
                },
                {   
                    userId:5,
                    userName: "dchostos",
                    password: "dc@hostos",
                    roles: [Constants.loginUserTypes.admin],
                    displayName: "Hostos - Command Center",                    
                    isSFOUser: false
                },
                {   
                    userId:6,
                    userName: "dccollegehunter",
                    password: "dc@collegehunter",
                    roles: [Constants.loginUserTypes.admin],
                    displayName: "College Hunter - Command Center",                    
                    isSFOUser: false
                },
                {   
                    userId:7,
                    userName: "dcbrooklyncollege",
                    password: "dc@brooklyncollege",
                    roles: [Constants.loginUserTypes.admin],
                    displayName: "Brooklyn College - Command Center",                    
                    isSFOUser: false
                }
];

// exports User's Site level authorisation
export const UsersBoroughSiteMapping = [
    {
        id:1,
        userId:1,
        boroughName:"Queens",
        siteNames:["La Guardia"]
    },
    {
        id:2,
        userId:1,
        boroughName:"Brooklyn",
        siteNames:["Brooklyn College"]
    },
    {
        id:3,
        userId:1,
        boroughName:"Bronx",
        siteNames:["Hostos"]
    },
    {
        id:4,
        userId:1,
        boroughName:"Manhattan",
        siteNames:["Hunter College"]
    },
    {
        id:5,
        userId:2,
        boroughName:"San Francisco",
        siteNames:["BayView","Civic Center","Mission","Sunset"]
    },
    {
        id:6,
        userId:3,
        boroughName:"San Francisco",
        siteNames:["BayView","Civic Center"]
    },
    {
        id:7,
        userId:4,
        boroughName:"Queens",
        siteNames:["La Guardia"]
    },
    {
        id:8,
        userId:7,
        boroughName:"Brooklyn",
        siteNames:["Brooklyn College"]
    },
    {
        id:9,
        userId:5,
        boroughName:"Bronx",
        siteNames:["Hostos"]
    },
    {
        id:10,
        userId:6,
        boroughName:"Manhattan",
        siteNames:["Hunter College"]
    }
]