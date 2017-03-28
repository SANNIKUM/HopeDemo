import React from "react";
import { connect } from "react-redux";
import { Constants } from "../../../../../common/app-settings/constants"
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { CommonService } from "../../../../shared/services/common.service";
import { reportsActionTypes } from "../../../actions/reportsActionTypes";
import * as Action from "../../../../shared/actions/action";

class DownloadSurveysComponent extends React.Component{

    constructor(props){
        super(props);
        this.onExcelDownload = this.onExcelDownload.bind(this);
    }
     /**
     * Set tab to DownloadSurveys on component mount.
     */
    componentDidMount() {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: Constants.reportsViewKeys.downloadsurveys }));
    }
    // download excel file containing all surveys submitted yet for all sites
    onExcelDownload(){
        CommonService.downloadExcel();   
    }
    render(){
        return (
            <div className="reports-download-excel">
                <div className="text-center"><button className="btn donwload-button"  onClick={()=>{this.onExcelDownload();}}>Download <i className="fa fa-download downloadicon" aria-hidden="true"></i></button></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
 return { 
     model:state.reportsModel,
     sharedModel: state.sharedModel
    };
}
export default connect(mapStateToProps)(DownloadSurveysComponent);;