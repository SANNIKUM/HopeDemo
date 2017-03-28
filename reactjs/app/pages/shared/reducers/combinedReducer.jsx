import {combineReducers} from 'redux';

import adminReducer from "../../admin/reducers/adminReducer.js";
import dashboardReducer from "../../dashboard/reducers/dashboardReducer.js";
import reportsReducer from "../../reports/reducers/reportsReducer.js";
import sharedReducer from "./sharedReducer.js";
/**
 * Using redux to combine reduces for dashboard, admin and shared.
 */
const reducer = combineReducers({dashboardModel: dashboardReducer, adminModel: adminReducer, sharedModel: sharedReducer,reportsModel:reportsReducer});

export default reducer;