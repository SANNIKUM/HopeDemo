import './assets/styles/main.css';
import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory, IndexRedirect,useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import store from './pages/shared/store';
import NoMatch from "./pages/shared/nomatch.jsx";
import Master from './pages/shared/master.jsx';
import AdminCMS from "./pages/admin/components/";
import WebDashboard from "./pages/dashboard/components/";
import Reports from "./pages/reports/components/";
import LoginComponent from "./pages/login/components/";
import RoutesSearchComponent from "./pages/admin/components/right-container/routes/";
import CanvasserSearchComponent from "./pages/admin/components/right-container/canvassers/";
import ListViewComponent from "./pages/dashboard/components/middle-container/list-view/";
import MapViewComponent from "./pages/dashboard/components/middle-container/map-view/";
import DataViewComponent from "./pages/dashboard/components/middle-container/data-view/";
import ReportsContainer from "./pages/reports/components/";
import DownloadSurveysComponent from "./pages/reports/components/middle-container/download-surveys/";
import {Constants} from "./common/app-settings/constants"
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const App = (props, _railsContext)=>(
    <Provider store={store}>
    <Router history={appHistory}>
        <Route path={Constants.pathNames.home} component={Master}>
            <IndexRedirect authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} to={Constants.pathNames.dashboard[2]}/>
            <Route path={Constants.pathNames.reports} component={Reports}>
                <IndexRoute authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} component={DownloadSurveysComponent}/>
                <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedReportsTab.downloadsurveys} component={DownloadSurveysComponent}/>
            </Route>
            <Route path={Constants.pathNames.admin} component={AdminCMS}>
                <IndexRoute authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} component={CanvasserSearchComponent}/>
                <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.canvasser} component={CanvasserSearchComponent}/>
                <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.route} component={RoutesSearchComponent}/>
            </Route>
            <Route path={Constants.pathNames.dashboard[2]} component={WebDashboard}>
                <IndexRoute authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} component={MapViewComponent}/>
                <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.dashBoardViewKey.mapView} component={MapViewComponent}/>
                <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.dashBoardViewKey.listView} component={ListViewComponent}/>
                <Route authorize={[Constants.loginUserTypes.admin]} path={Constants.dashBoardViewKey.dataView} component={DataViewComponent}/>
            </Route>
        </Route>
        <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.pathNames.login} component={LoginComponent}/>
        <Route path={Constants.pathNames.noMatch} component={NoMatch}/>

    </Router>
</Provider>
)

export default App;
