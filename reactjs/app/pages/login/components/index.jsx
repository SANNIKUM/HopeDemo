import React from "react";
import { connect } from "react-redux";

import { Constants } from "../../../common/app-settings/constants";
import { sharedActionTypes } from "../../shared/actions/sharedActionTypes";
import * as Action from "../../shared/actions/action";
import { LoginService } from "../services/login.service.jsx";
const header_logo = require("../../../assets/img/dss_logo_white_sm.png");
const login_left_img = require("../../../assets/img/login-bg/login-left-img.jpg");
const dhs_logo_blue = require("../../../assets/img/login-bg/dhs_logo_blue.png");

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onSetPassword = this.onSetPassword.bind(this);
        this.onSetUserName = this.onSetUserName.bind(this);
        this.onSetRememberMe = this.onSetRememberMe.bind(this);
        this.onSetErrorMessage = this.onSetErrorMessage.bind(this);
        this.logIn = this.logIn.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    componentWillMount() {
        LoginService.checkLoginOnLoginScreen();
    }
    logIn() {

        let model = this.props.model;
        let isLoggedIn = false;
        if ((model.password.length == 0) && (model.userName.length == 0)) {
            this.onSetErrorMessage(Constants.messages.loginMessages.emptyUserNamePassword);
            return;
        }

        if (!model.userName || model.userName.length == 0) {
            this.onSetErrorMessage(Constants.messages.loginMessages.emptyUserName);
            return;
        }
        else if (!model.password || model.password.length == 0) {
            this.onSetErrorMessage(Constants.messages.loginMessages.emptyPassword);
            return;
        }
        else if ((model.password.length !== 0) && (model.userName.length !== 0)) {
            for (let index = 0; index < model.users.length; index++) {
                if (model.users[index].userName === model.userName && model.users[index].password === model.password) {
                    isLoggedIn = true;
                    let loginObject = { isLoggedIn: true, userName: model.users[index].userName, displayName: model.users[index].displayName, roles: model.users[index].roles, isSFOUser: model.users[index].isSFOUser,userId: model.users[index].userId };
                                      
                    this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOGGED_IN, loginObject ));
                    LoginService.setLogin(loginObject);
                    window.setTimeout(() => {
                        window.location.href = ("/#/dashboard/mapview/");
                    }, 300);
                    break;
                }
            }
            if (!isLoggedIn) {
                this.onSetErrorMessage(Constants.messages.loginMessages.invalidCredentials);
            }
        }



    }
    onKeyDown(event) {
        if (event.keyCode == 13) {
            this.logIn();
        }
    }
    onSetPassword(event) {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOGIN_PASSWORD, { value: event.target.value }));
    }
    onSetUserName(event) {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOGIN_USERNAME, { value: event.target.value }));
        return true;
    }
    onSetRememberMe(event) {
        let isChecked = !this.props.model.rememberMe;
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOGIN_REMEMBERME, { value: isChecked }));
    }
    onSetErrorMessage(message) {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOGIN_ERROR_MESSAGE, { value: message }));
    }
    render() {

        let model = this.props.model;

        return (

            <div className="loginContainer">
             <div className="loginbg"> </div>
                <div id="header"className="header navbar navbar-default navbar-fixed-top">           
                    <div className="container-fluid">
                        <div className="navbar-header nav-header-logo">
                            <img src={header_logo} alt="DSS" width="190" height="33" />
                        </div>
                    </div>
                </div>
                <div className="login-contents">
                    <div className="login-left-container">
                        <img src={login_left_img} alt="DSS" className="login-left-img" />
                        <div className="login-caption">
                            <h4 className="caption-title"><i className="fa fa-diamond"></i>  DHS | HOPE | Quarterly Count</h4>
                            <p></p>
                        </div>
                    </div>
                    <div className="login-right-container">
                        <div className="right-content">

                            <div className="login-header">
                                <div className="brand">
                                    <img src={dhs_logo_blue} alt="dhs_logo_blue" width="62%" /><br /><br />
                                    <small>HOPE: Please Sign In</small>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-sign-in"></i>
                                </div>
                            </div>

                            <div className="login-content">
                                <div className="margin-bottom-0" name="LoginForm">
                                    <div className="form-group m-b-15">
                                        {
                                            (model.errorMessage.length > 0) ?
                                                <span className="login-error-message" > {model.errorMessage} </span>
                                                : ""
                                        }
                                    </div>
                                    <div className="m-b-15">
                                        <label>
                                            Please enter your username or domain\username and password to log in (for ex- username or DHS\UserName)
                                        </label>
                                    </div>
                                    <div className="form-group m-b-15">
                                        <input autoComplete="off" autoCorrect="off" autoCapitalize="off" className=" form-control extra-height" onChange={(e) => { this.onSetUserName(e) } } maxLength="200" onKeyDown={(e) => { this.onKeyDown(e) } } placeholder="User Name" type="text" value={model.userName} />

                                    </div>
                                    <div className="form-group m-b-15">
                                        <input autoComplete="off" autoCorrect="off" autoCapitalize="off" className=" form-control extra-height" id="txtPassword" maxLength="200" name="Password" placeholder="Password" type="password" onKeyDown={(e) => { this.onKeyDown(e) } } value={model.password} onChange={(e) => { this.onSetPassword(e) } } />
                                    </div>
                                    <div className="checkbox m-b-30">

                                        {model.rememberMe ?
                                            <label>
                                                <input className="checkbox-fix" type="checkbox" checked={true} onChange={(e) => { this.onSetRememberMe(e) } } />       Remember Me</label>
                                            : <label><input className="checkbox-fix" type="checkbox" checked={false} onChange={(e) => { this.onSetRememberMe(e) } } />              Remember Me
                                                    </label>
                                        }

                                    </div>

                                    <div className="login-buttons">
                                        <button className="btn btn-success btn-block btn-lg" onClick={this.logIn}>Sign me in</button>
                                    </div>
                                    <div className="m-t-20 m-b-40 p-b-40">
                                        For support please contact <a href="mailto:hope@DHS.nyc.gov" className="text-success">QC HOPE User Support</a>.
                                        <br />
                                        <a href="#" className="text-success displaynone" target="_blank">Change Agency Password?</a>
                                    </div>
                                    <br />
                                    <hr />
                                    <p className="text-center text-inverse">
                                        &copy; Copyright Department of Homeless Services 2016
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        );

    }
}
const mapStateToProps = (state) => {
    return {
        model: state.sharedModel.loginDetails
    }
}

export default connect(mapStateToProps)(LoginComponent);