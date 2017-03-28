import { CommonService } from "../../shared/services/common.service";
import { Constants } from "../../../common/app-settings/constants";

/**
 * Login service.
 */
let LoginService = {
    /**
     * Checks login to Redirect to login if the login details are not present in local staorage.
     */
    checkLogin: function () {
        let session = localStorage.getItem("loginDetails");

        if (session) {

            let sessionJSON = JSON.parse(session);
            if (sessionJSON.isLoggedIn !== true) {
                window.location.href = "/#/login/";
            }
            else
            {
                return sessionJSON;
            }

        } else {
            window.location.href = "/#/login/";
        }
    },
    getLoginObject:function(){
        let session = localStorage.getItem("loginDetails"); 
        return session ? JSON.parse(session) :  null;
    },
    setLogin: function (details) {
        if(details){
            let role = Constants.loginUserTypes.sfUser;
            if(details.roles.indexOf(Constants.loginUserTypes.admin)>-1)
                role = Constants.loginUserTypes.admin;
            details.selectedRole = role;
        }
        localStorage.setItem("loginDetails", JSON.stringify(details));
    },

    /**
     * Checks login
     */
    checkLoginOnLoginScreen: function () {
        let session = localStorage.getItem("loginDetails");
        if (session) {
            let sessionJSON = JSON.parse(session);
            if (sessionJSON.isLoggedIn === true) {
                window.location.href = "/#/dashboard/";
            }
        }

    },
    /**
     * Logout functionality to remove login details from local storage
     */
    setLogout: function () {
        localStorage.removeItem("loginDetails");
        window.location.href = "/#/login/";
    }
};

exports.LoginService = LoginService;