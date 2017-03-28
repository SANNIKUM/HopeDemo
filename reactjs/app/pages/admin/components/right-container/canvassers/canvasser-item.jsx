import React from  "react";
import { connect } from "react-redux";
const double_vertical_liner = require("../../../../../assets/img/double-vertical-liner.png");
const team_icon = require("../../../../../assets/img/teams-icon.png");

class CanvasserItemComponent extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
            let { canvasser } = this.props;
        return (
            <div className="right-side-route-item" >      
                    <div className="team-left">
                    {
                        canvasser.teams.length == 0 ? <div className="canvasser-unassigned-team" /> : <img src={double_vertical_liner} className="double-liner" />
                    }
                
                        <div className="team-details">
                        <label className="members-count">
                        <label onClick={(e) => { this.props.onOpenEditCanvasserDialog(e, canvasser) } } className="canvasser-name ellipses"> {!(canvasser.firstName && canvasser.lastName) ?  canvasser.name :((canvasser.firstName ? (canvasser.firstName) : '') + " " + (canvasser.lastName ? canvasser.lastName : ''))}</label>
                        </label>
                        <label className="ellipses">
                        {
                            <span>{canvasser.email ? canvasser.email : canvasser.name}</span>
                        }
                        </label>
                        <label className="members-route">
                        {
                            <div style={{"width":"175px","fontSize":"11px"}} className="ellipses">
                            <span style={{"marginRight": "5px"}}>{this.props.model.filterModel.selectedSite ? this.props.model.filterModel.selectedSite.siteName + " -" :''}</span>
                            <span className={canvasser.teams.length == 0 ? 'unassigned-team' : 'canvasser-assigned-team-name'}>{canvasser.teams.length == 0 ? 'Unassigned Team' : canvasser.teams[0].label}</span>
                        </div>}
                        </label>
                    </div>
                    </div>
                     <div className="clear"></div>
                </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    model: state.adminModel
  }
};
export default connect(mapStateToProps)(CanvasserItemComponent);