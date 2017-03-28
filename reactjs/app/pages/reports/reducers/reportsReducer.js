import { reportsState } from "../state/";
import {reportsActionTypes} from "../actions/reportsActionTypes";

export default(state = reportsState,action) => {

    let stateCopy = {};
    /**
     * Create a copy of the state on which actions will be performed.
     */
    if (reportsActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {
        case reportsActionTypes.DONWLOAD_SURVEYS_EXCEL:
        {
            stateCopy.isDownloadingReport = action.payload; 
            return stateCopy;
        }
        case reportsActionTypes.SET_PANEL_EXPAND_REPORTS:
            {
                stateCopy.panelProperties.panelExpanded = !stateCopy.panelProperties.panelExpanded;
                return stateCopy;
            }
        case reportsActionTypes.SET_PANEL_RELOAD_REPORTS:
            {
                stateCopy.panelProperties.panelReload = !stateCopy.panelProperties.panelReload;
                return stateCopy;
            }
        case reportsActionTypes.SET_PANEL_COLLAPSE_REPORTS:
            {
                stateCopy.panelProperties.panelCollapsed = !stateCopy.panelProperties.panelCollapsed;
                return stateCopy;
            }
        case reportsActionTypes.SET_PANEL_REMOVE_REPORTS:
            {
                stateCopy.panelProperties.panelRemoved = action.payload;
                return stateCopy;
            }
       default:
            return state;
    }

};