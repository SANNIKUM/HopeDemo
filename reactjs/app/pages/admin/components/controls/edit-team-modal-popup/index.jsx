import React from "react";
import { connect } from 'react-redux';
import Modal from 'tg-modal';
import TeamMember from './team-member'
import RouteList from './route-list'
import ValidationControl from '../../../../shared/controls/validation-control';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { Utility } from "../../../../../common/utility";
import ConfirmDialog from '../../../../shared/controls/confirm-dialog-control';
import { AdminCMSService } from '../../../services/admin-cms.service';

class EditTeamModal extends React.Component {

    constructor(props) {
        super(props);  
         this.onRemoveTeam = this.onRemoveTeam.bind(this);           
    }
/**
 * remove team 
 */
    onRemoveTeam(eve){
         let Team =this.props.model.teamToEdit;
         let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.teamRemoveConfirm, Team.name, Team.name);
        ConfirmDialog(confirmMessage).then(  
             (result) => {
                  this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true)); 
                  AdminCMSService.removeTeam(Team.id).then((response) => {
                    if (response.data.destroyAssignment) {
                      this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM, Team.id));
                       AdminCMSService.getRoutesBySite(this.props.model.filterModel.selectedSite.siteId)
                            .then(response => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, response.data.site.routes));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected:false }));
                                AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId)
                                    .then(response => {
                                    this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                                    this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));                              
                                    this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false)); 
                                    this.props.onCancel(eve);                                 
                                 });                                     
                         });  
                                    
                    } else {
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false)); 
                        throw new Error(Constants.messages.commonMessages.someErrorOccured);
                    }
                })
                .catch((err) => {
                    this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));  
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));
                  
                });                
             },
                (result) => {
                    this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage : Constants.emptyString}));
                }
        )
    }   
   
    render() { 
        return (             
            <div className="container edit-team-container">
                <Modal isOpen={this.props.isOpen} autoWrap title={this.props.model.teamToEdit.label} isStatic={this.props.loader} onCancel={(e) => this.props.onCancel(e)} className="myclass">
                    <ValidationControl message={this.props.model.validation.message} type={this.props.model.validation.type} isPopup={this.props.model.validation.isPopup} />
                    {this.props.loader ? <div className="model-loader"><span className="spinner"></span></div> : ''}
                    <label>Members ({this.props.model.teamToEdit.users.length}) :-</label>                   
                    <TeamMember />
                    <label className="label-team-routes">Routes ({this.props.model.teamToEdit.routes.length}) :-</label>
                    <RouteList />  
                    <div className="delete-team-footer-bar"> <button className="button remove-team-button" onClick={(e) => this.onRemoveTeam(e)} >Delete Team</button> </div>
                </Modal>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.adminModel
    }
}

export default connect(mapStateToProps)(EditTeamModal);