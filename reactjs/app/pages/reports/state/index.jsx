import { Constants } from "../../../common/app-settings/constants"


// dashboard section state
export const reportsState = { 
    "isDownloadingReport":false,
    "panelProperties": {
                "panelExpanded": false,
                "displayRefreshButton": false,
                "panelReload": false,
                "panelCollapsed": false,
                "panelRemoved": false
    },
    "validation": {
                "message": "",
                "type":  Constants. validation.types.success.key,
                "isPopup": false
    }
};
