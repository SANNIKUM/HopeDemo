import React from "react";
import { connect } from 'react-redux';
import { AdminCMSService } from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { Utility } from "../../../../../common/utility";
import ConfirmDialog from '../../../../shared/controls/confirm-dialog-control';

class TeamMember extends React.Component{
    constructor(props) {
        super(props);
        this.onUserRemove = this.onUserRemove.bind(this);
        this.setLeader = this.setLeader.bind(this);  
    }

 onUserRemove(user) {
        let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.memberRemoveConfirm, user.name, this.props.model.teamToEdit.name);
        ConfirmDialog(confirmMessage).then(
            (result) => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true));
                AdminCMSService.destroyRelationFrom(this.props.model.teamToEdit.id, user.id ).then((response) => {
                    if (response.data.destroyAssignmentRelation) {
                        this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM_MEMBER, { teamId: this.props.model.teamToEdit.id, userId: user.id }));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                        AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId)
                            .then(response => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, response.data.site.users));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));                              
                               
                     });
                    } else {
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
        );
    }
    setLeader(Leader) {      
        let oldLeaderIds = [];
        this.props.model.teamToEdit.users.forEach(function(user){      
                if(user.id != Leader.id)
                {
                          oldLeaderIds.push(user.id);                        
                }   
        })
        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true));  
        if(Leader.isTeamLeader=="true"){
            oldLeaderIds= [];
            oldLeaderIds.push(Leader.id);
            AdminCMSService.setLeader(-1, oldLeaderIds)
                            .then(response => {
                                 let newLaeder = JSON.parse(JSON.stringify(Leader))
                                 newLaeder.id = -1;
                                 this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_LEADER, { Leader : newLaeder }));
                                 this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));  
                                 this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));

                            }).catch((err) => 
                            {
                                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, 
                                                                { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));                    
                });
        }
        else
        {
            AdminCMSService.setLeader(Leader.id, oldLeaderIds)
                            .then(response => {
                                 this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_LEADER, { Leader : Leader }));
                                 this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));  
                                 this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected:true }));

                            }).catch((err) => 
                            {
                                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, 
                                                                { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));                    
                });
        }
         
       
    }
    render(){
       return  <div className="team-members custom-scroll">
         {
          this.props.model.teamToEdit.users.length ?
                                this.props.model.teamToEdit.users.map((user, index) => {
                                 return (                                                          
                                        <div className="team-row "  key={"team-user-" + index}>
                                            ({(index + 1)}).<span className= {"member-name"} >{user.name}</span> <span className="member-email">{user.email}</span>
                                            <span className={"leader "+((user.isTeamLeader=="true") ? " active ": "")} onClick={() => { this.setLeader(user) } } title={(user.isTeamLeader=="false") ? "Set Team Leader" : ''} >Team Leader</span>                      
                                            <i className="fa fa-times-circle-o remove-row-icon" onClick={() => { this.onUserRemove(user) } } title="Remove canvasser from team."></i>
                                        </div>                                 
                                    );
                                })
                                :
                           <div className="team-row no-routes">{ Constants.messages.noTeamMember }</div>
         }
     </div>
    }
}


const mapStateToProps = (state) => {
    return {
        model: state.adminModel
    }
}

export default connect(mapStateToProps)(TeamMember);