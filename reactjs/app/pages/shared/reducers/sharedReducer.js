import { sharedActionTypes } from "../actions/sharedActionTypes";
import { sharedState } from "../state/";

export default (state = sharedState, action) => {

    let stateCopy = {};
    /**
     * Create a copy of the state on which actions will be performed.
     */
    if (sharedActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {

        case sharedActionTypes.SET_LEFT_MENU_EXPANDED:
            {
                stateCopy.leftMenuExpaned = !stateCopy.leftMenuExpaned;
                return stateCopy;
            }
        case sharedActionTypes.SET_RIGHT_SIDE_EXPANDED:
            {
                stateCopy.isRightPanelExpanded = !stateCopy.isRightPanelExpanded;
                return stateCopy;
            }
        case sharedActionTypes.SET_TAB_CHANGE:
            {
                stateCopy
                    .tabs
                    .forEach((tab, index) => {
                        tab.isSelected = (tab.key === action.payload.key);
                    })
                let category = stateCopy
                    .tabs
                    .filter((tab) => tab.key == action.payload.key)[0]
                    .category;
                stateCopy
                    .menuPanels
                    .forEach((panel) => {
                        panel.isOpened = (panel.value == category);
                    })
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_USERNAME:
            {
                stateCopy.loginDetails.userName = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_PASSWORD:
            {
                stateCopy.loginDetails.password = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_REMEMBERME:
            {
                stateCopy.loginDetails.rememberMe = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_ERROR_MESSAGE:
            {
                stateCopy.loginDetails.errorMessage = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGGED_IN:
            {
                stateCopy.loginDetails.isloggedIn = action.payload.isLoggedIn;
                stateCopy.loginDetails.userName = action.payload.userName;
                stateCopy.loginDetails.displayName = action.payload.displayName;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOG_OUT:
            {
                return sharedState; // Reset to Original State after Logout
            }
        case sharedActionTypes.SET_LEFT_MENU_TOGGLE:
            {
                if (stateCopy.menuPanels && stateCopy.leftMenuExpaned) {
                    stateCopy
                        .menuPanels
                        .forEach((panel) => {
                            if (panel.value == action.payload.panel.value) {
                                panel.isOpened = !panel.isOpened;
                            } else {
                                panel.isOpened = false;
                            }
                        })
                }
                return stateCopy;
            }
        case sharedActionTypes.SET_TOGGLE_PROFILE_MENU:
            {
                stateCopy.profileMenu.isOpened = !stateCopy.profileMenu.isOpened;
                return stateCopy;
            }
        case sharedActionTypes.SET_DOCUMENT_CLICK:
            {
                stateCopy.profileMenu.isOpened = action.payload;
                return stateCopy;
            }
        case sharedActionTypes.SET_LEFT_MENU_SMALL_SCREEN_TOGGLED:
            {
                stateCopy.smallScreenLeftMenuOpened = !stateCopy.smallScreenLeftMenuOpened;
                return stateCopy;
            }
        case sharedActionTypes.SET_RIGHT_MENU_SMALL_SCREEN_TOGGLED:
            {
                stateCopy.smallScreenRightMenuOpened = !stateCopy.smallScreenRightMenuOpened;
                return stateCopy;
            }
        case sharedActionTypes.SET_ROUTE_ON_MAP_OPENED:
            {
                stateCopy.routesOnMap.isOpened = action.payload.isOpened;
                stateCopy.routesOnMap.popupLoaderShown = action.payload.popupLoaderShown;
                if(action.payload.routeObject)
                    stateCopy.routesOnMap.routeObject = action.payload.routeObject;
                return stateCopy;
            }
        default:
            return state;
    }

}