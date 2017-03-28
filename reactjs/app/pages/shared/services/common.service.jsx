import fetch from "isomorphic-fetch";

import { API_URLs, Constants } from "../../../common/app-settings/constants";
import { LoginService } from "../../login/services/login.service";

/**
 * Set the request body and headers.
 */
var CommonService = {


  getRoleSettings: function () {
    let roleName = null;
    let logindetails = JSON.parse(localStorage.getItem("loginDetails"));
    if (!logindetails) {
      LoginService.checkLogin();
      roleName = null;
    }
    else {
      roleName = logindetails.selectedRole;
      return API_URLs[roleName];
    }
    return null;
  },
  /**
   * get current login user role
   */
  isNonAdmin: function () {
    let roleName = null;
    let logindetails = JSON.parse(localStorage.getItem("loginDetails"));
    if (!logindetails) {
      LoginService.checkLogin();
    }
    else {
      roleName = logindetails.selectedRole;
    }
    return roleName == Constants.loginUserTypes.sfUser;
  },
  isSFOUser: function () {
    let loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
    let isSFOUser = false;
    if (loginDetails) {
      isSFOUser = loginDetails.isSFOUser;
    }
    return isSFOUser;
  },
  /**
  * Set the content type for graphQL.
  */
  getHeaders: function () {
    return { "content-type": "application/graphql"};
  },
  /**
    * Ajax call to the graphQL endpoint.
    */
  sendRequest: function (body) {
    let sessionDetails = CommonService.getRoleSettings();
    if (sessionDetails) {
      return fetch(CommonService.getRoleSettings().SERVER_BASE_URL,
        {
          method: 'POST',
          body: body,
          headers: this.getHeaders()
        })
        .then(response => {
          if (!response.ok)
            throw Error(response.statusText);

          return response.json();
        });
    }
    else {
      LoginService.checkLogin();
      return new Promise(() => console.log("logout"), () => console.log("error"))
    }

  },
  renderError: function (errorResponse) {
    console.log("Error :: ", errorResponse);
  },
   getGeoJSON:function(Geo_JSON_URL){
      return fetch(Geo_JSON_URL,
         {
            method: 'GET',
         })
        .then(response => 
        {
            if (!response.ok) 
              throw Error(response.statusText);
          return response.json();
        });
   },
   downloadExcel : () => {
        let excelURL = CommonService.getRoleSettings().SURVEY_EXCEL_DOWNLOAD_URL;
        let  method = "get";
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", excelURL);

        document.body.appendChild(form);
        form.submit();
        form.remove();
   }

}

exports.CommonService = CommonService;