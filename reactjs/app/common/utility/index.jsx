import {Constants} from '../app-settings/constants';

let Utility = {
    sectorsSize: 5,
    dashRefreshInterval: null,
    adminRefreshInterval:null,
    getSectorsDivisions: function (maxValue) {

        let divisions = [];

        if (!isNaN(maxValue)) {

            let pointer = 1;

            while (pointer <= maxValue) {

                divisions.push({
                    label: (this.getPrefixedZero(pointer) + "-" + this.getPrefixedZero(pointer + this.sectorsSize - 1)),
                    value: (this.getPrefixedZero(pointer) + "-" + this.getPrefixedZero(pointer + this.sectorsSize - 1))
                });

                pointer += this.sectorsSize;
            }
        }

        return divisions;

    },
    getPrefixedZero: function (number) {
        return (number.toString().length == 1)
            ? ("0" + number)
            : number.toString();
    },
    onWindowResize: function () {
        window.setTimeout(() => {
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 500);
    },
    setInterval: function (callbackFunction, timeSpan) {

        let milisecondsString = timeSpan
            .replace(/h/g, '*60*60*1000')
            .replace(/m/g, '*60*1000')
            .replace(/s/g, '*1000');
        let span = parseFloat(milisecondsString.split('*').reduce((item, multiply) => {
            return item * multiply;
        }));

        this.dashRefreshInterval = window.setInterval(() => {
            callbackFunction();
        }, span);
    },
    clearInterval: function () {
        if (this.dashRefreshInterval) {
            window.clearInterval(this.dashRefreshInterval);
        }
    },
    setAdminInterval: function (callbackFunction, timeSpan) {

        let milisecondsString = timeSpan
            .replace(/h/g, '*60*60*1000')
            .replace(/m/g, '*60*1000')
            .replace(/s/g, '*1000');
        let span = parseFloat(milisecondsString.split('*').reduce((item, multiply) => {
            return item * multiply;
        }));

        this.adminRefreshInterval = window.setInterval(() => {
            callbackFunction();
        }, span);
    },
    clearAdminInterval: function () {
        if (this.adminRefreshInterval) {
            window.clearInterval(this.adminRefreshInterval);
        }
    },
    abortAllPromises(callbackFunction) {
        if (window.mapPromises && window.mapPromises.length) {
            window
                .mapPromises
                .forEach((promise) => {
                    if (promise) {
                        if (promise.terminate) {
                            promise.terminate();
                            console.log("promise terminated..");
                        }
                        promise.length = 0; // make array empty
                    }
                })
        }
        // remove loader from screen
        if (callbackFunction) 
            callbackFunction();
        }
    ,
    formatAMPM: function (date) {
        if (date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12
                ? 'PM'
                : 'AM';
            hours = hours % 12;
            hours = hours
                ? hours
                : 12; // the hour '0' should be '12'
            minutes = minutes < 10
                ? '0' + minutes
                : minutes;
            let strTime = (hours < 10 ? ("0"+hours): (hours)) + ':' + minutes + ' ' + ampm;
            return strTime;
        } else 
            return "";
        }
    ,
    getFilteredRoutes: function (allRoutes, selectedBoroughValue, selectedSiteValue, selectedTeamValue,selectedFilterKey) {

        let routes = allRoutes.filter((route) => (selectedBoroughValue.boroughId == -1 || route.boroughId == selectedBoroughValue.boroughId) 
                                                && (selectedSiteValue.siteId == -1 || route.siteId == selectedSiteValue.siteId) 
                                                && (selectedTeamValue.teamId == -1 || route.teamId == selectedTeamValue.teamId)
                                                && (!selectedFilterKey || (route.routeStatus == selectedFilterKey)));
        return routes;

    },
    getRoutesWithStatusFilter: function (filteredRoutes,filteredRouteStatus) {
        if(filteredRoutes){
            let routes = filteredRoutes.filter((route) => (filteredRouteStatus.value == 1 || (route.routeStatus).toLowerCase() == filteredRouteStatus.key.toLowerCase()));
            return routes;
        }
        else return [];

    },
    getFilteredTeams: function (allTeams, selectedBoroughValue, selectedSiteValue, selectedTeamValue) {

        let teams = allTeams.filter((team) => (selectedBoroughValue.boroughId == -1 || team.boroughId == selectedBoroughValue.boroughId) && (selectedSiteValue.siteId == -1 || team.siteId == selectedSiteValue.siteId) && (selectedTeamValue.teamId == -1 || team.teamId == selectedTeamValue.teamId));
        return teams;

    },
    stringFormat: function () {
        let s = arguments[0];
        for (let i = 0; i < arguments.length - 1; i++) {
            let reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    },
    validateEmail: function (email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    /**Generate path element for a given degree. */
    generatePath: function (degrees, radius, edgeSize) {
        const radians = (degrees * Math.PI / 180);
        var x = Math.sin(radians) * radius;
        var y = Math.cos(radians) * -radius;
        const halfEdgeSize = edgeSize / 2;
        x += halfEdgeSize;
        y += halfEdgeSize;
        const largeArcSweepFlag = degrees > 180
            ? 1
            : 0;
        const startX = halfEdgeSize;
        const startY = halfEdgeSize - radius;
        return `M${startX},${startY} A${radius},${radius} 0 ${largeArcSweepFlag} 1 ${x},${y} `;
    },

    /**
     * Gets the coordinates in cartesian form for a circle centered at (centerX, centerY) having radius and sector angle "angleInDegrees".
     */
    polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    },

    /**
     * Draw the arc from startAngle to endAngle.
     */
    drawArc: function (centerX, centerY, radius, startAngle, endAngle) {

        var start = Utility.polarToCartesian(centerX, centerY, radius, endAngle);
        var end = Utility.polarToCartesian(centerX, centerY, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180
            ? "0"
            : "1";

        var path = [
            "M",
            start.x,
            start.y,
            "A",
            radius,
            radius,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y
        ].join(" ");

        return path;
    },

    /**
     * Converts the percentage completed to the color to be shown for circle.
     */
    percentToRGB: function (percent) {
        let redColor,
            greenColor,
            blueColor;
        redColor = Constants.circularProgressChart.startRedColor - Math.floor(percent * Constants.circularProgressChart.redColorDilutionValue); //208 to 9
        greenColor = Constants.circularProgressChart.startGreenColor + Math.floor(percent * Constants.circularProgressChart.greenColorDilutionValue); //11 to 170
        blueColor = Constants.circularProgressChart.startBlueColor + Math.floor(percent * Constants.circularProgressChart.blueColorDilutionValue); //20 to 165
        return "rgb(" + redColor + "," + greenColor + "," + blueColor + ")";
    },
    /**
 * Restricts the value n to be within a specified range.
 */
    clamp: function (n, min, max) {
        return Math.max(min, Math.min(max, n));
    },
    getSubwayRouteName:function(route){
        let name = route.routeName || route.name;
        return (route.routeType == Constants.routeTypeOptions[2].value ? (name + (route.station ? ": " + route.station :'')) : name);
    },
    sortTeamByNameAsc:function(fieldName){
        return  (a, b) => {
            if(a[fieldName] && a[fieldName].indexOf("_") >-1 && b[fieldName] && b[fieldName].indexOf("_") >-1){
                        if (a[fieldName] && b[fieldName] && a[fieldName].split('_').length == 2 && b[fieldName].split('_').length == 2) {
                            let _a = parseInt(a[fieldName].trim().split("_")[1]),_b = parseInt(b[fieldName].trim().split("_")[1]);
                            
                            // spacially handling string values , palcing string to last of the array 
                            if(isNaN(_a) && !isNaN(_b)){
                                return 1;
                            }
                            else if(!isNaN(_a) && isNaN(_b))
                            {
                                return -1;
                            }
                            else if(isNaN(_a) && isNaN(_b)){
                                return (a[fieldName].trim().split("_")[1] < b[fieldName].trim().split("_")[1] ? -1 : (a[fieldName].trim().split("_")[1] > b[fieldName].trim().split("_")[1] ? 1 : 0));
                            }
                            return (_a < _b ? -1 : (_a > _b ? 1 : 0));
                        } else if(a[fieldName] && b[fieldName]) {
                            return (a[fieldName].trim() < b[fieldName].trim()? -1: (a[fieldName].trim() > b[fieldName].trim()? 1: 0));
                        }
                        else return 1;
                    }
                    else
                        return -1;
        }
        
    },  
    isTouchDevice : function() {
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
    },
    getLoginDetails : ()=> JSON.parse(localStorage.getItem('loginDetails')),
    // returns an object of routes {completed,inprogress,notstarted}
    getRoutesStats:(allRoutes)=>{

        let stats={completed:0,inprogress:0,notstarted:0};

         allRoutes.forEach((route)=> {
            if (route.routeStatus && route.routeStatus.toLowerCase() === Constants.routeStatusKey.completed.key.toLowerCase())
                stats.completed++;
            else if (route.routeStatus && route.routeStatus.toLowerCase() === Constants.routeStatusKey.inProgress.key.toLowerCase())
                 stats.inprogress++;
            else if (route.routeStatus && route.routeStatus.toLowerCase() === Constants.routeStatusKey.notStarted.key.toLowerCase())
                 stats.notstarted++;
         })

         return stats;
    },
    getRoutePercentage:(totalRoutesLength,inprogress,completed,notStarted)=>{
        let percent = 0;        
        if (totalRoutesLength){            
            if(inprogress){
                let adjustedInprogress = (inprogress == 1) ? (inprogress*1.0/2) : (inprogress - 1);
                percent = Math.round(((completed + adjustedInprogress) * 1.0) / totalRoutesLength * 100);
            }
            else
                percent = Math.round((completed * 1.0) / (totalRoutesLength) * 100);
        }
        return percent;
    },
    getTeamsNeedingEscort:(allTeams)=>{
        let count=0;
            if(allTeams){
                allTeams.forEach(team=>{
                    let needNYPD = (team.routes.filter(route=> route.needNypd == "true").length > 0);
                    if(needNYPD)
                        count++;
                })
            }
        return count;
    }
   
};

exports.Utility = Utility;