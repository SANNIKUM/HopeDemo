'use strict';
import React, { Component, PropTypes } from 'react';
import DragLayer from 'react-dnd/lib/DragLayer';
import  CanvasserItemComponent  from "./canvasser-item";

const double_vertical_liner = require("../../../../../assets/img/double-vertical-liner.png");

function collect (monitor) {
    return {
        sourceOffset: monitor.getSourceClientOffset()
    };
}

class DragPreview extends Component {
    getLayerStyles() {      
        const { sourceOffset } = this.props;   
        return {       
            left : sourceOffset? `${-window.innerWidth + 240+sourceOffset.x}px `:0,
            top: sourceOffset? `${ this.props.ItemNo * 91 + sourceOffset.y }px`:0,
            width:"200px"

        };
    }

    render () {
        const { isDragging , canvasser} = this.props;
        if (!isDragging) { return  null };

        return (
            <div className="source-preview " style={this.getLayerStyles()} >
               <CanvasserItemComponent canvasser={canvasser} onOpenEditCanvasserDialog={(e) => { this.props.onOpenEditCanvasserDialog(e, canvasser) } } />
            </div>
        );
    }
}

DragPreview.propTypes = {
    isDragging: PropTypes.bool,
    sourceOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    })
};

export default DragLayer(collect)(DragPreview);
