import React from "react";
import { connect } from "react-redux";

import ScrollArea from "react-scrollbar";

import Modal from 'tg-modal';
import Canvasser from "./canvasser";
import { AdminCMSService } from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import AuthorizedComponent from "../../../../shared/base/authorized-component";

const team_add_button = require("../../../../../assets/img/teams-add-button.png");

class CanvasserSearchComponent extends AuthorizedComponent {

  constructor(props) {
    super(props);
    this.onOpenDialog = this.onOpenDialog.bind(this);
    this.onOpenEditCanvasserDialog = this.onOpenEditCanvasserDialog.bind(this);
  }
  componentDidMount() {
    let canvassersSelected = (this.props.location.pathname.indexOf(Constants.pathNames.canvasser) > 0); // current loaded then
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: canvassersSelected ? Constants.selectedAdminTab.canvasser : Constants.selectedAdminTab.route }));
  }
  onOpenDialog() {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_CONVASSERS_DIALOG_OPEN, { IsOpen: true }));
  }

  onOpenEditCanvasserDialog(e, canvasserObject) {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_EDIT_CANVASSER_DIALOG_OPEN, { IsOpen: true, canvasser: canvasserObject }));
  }

  render() {

    this.searchedCanvassers = this.props.model.rightSideModel.searchedCanvassers;

    return (
      <div>
        <li className="nav-widget canvasserrs-search">
          <div className="right-side-filtered-routes filtered-canvassers ">
            <label>Canvassers {"(" + (this.searchedCanvassers ? this.searchedCanvassers.length : 0) + ")"} </label>
            <img src={team_add_button} alt="" className="open-team-add-button" onClick={() => { this.props.model.filterModel.selectedSite ? this.onOpenDialog() : '' } } disabled={!this.props.model.filterModel.selectedSite} />

            <div className="right-side-route-items custom-scroll"  >
              {
                this.searchedCanvassers && this.searchedCanvassers.length ?
                  this.searchedCanvassers.map((canvasser, index) => {
                    return (
                  <Canvasser ItemNo = {index} onOpenEditCanvasserDialog={(e, canvasser) => { this.onOpenEditCanvasserDialog(e, canvasser) } } canvasser={canvasser} key={index} />
                      
                    )
                  })
                  :
                  <div className="no-records-found"></div>
              }           
            </div>
          </div>

        </li>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    model: state.adminModel
  }
};
export default connect(mapStateToProps)(CanvasserSearchComponent);