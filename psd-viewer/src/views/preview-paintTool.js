/* @flow */
import React from 'react';
import cx from 'react/lib/cx';
import getLayerId from '../utils/get-layer-id';
import getLayerOffset from '../utils/get-layer-offset';
import getCanvasPositin from '../utils/get-canvas-position';

let T = React.PropTypes;

let Layer = React.createClass({
    propTypes: {
        layer: T.object,
        scale: T.number,
        lineWidth: T.number,
        lineColor: T.string,
    },

    getInitialState() {
        return {};
    },
    getDefaultProps() {
        return {
            scale: 1
        };
    },

    render(){
        if (!this.props.layer) return false;
        let {layer}=this.props;
        let {scale}=this.props;
        if(layer.isLayer()) {
            return (
                <div className={this.getClassName(layer)}
                     style={this.getStyle(layer)}
                    onMouseDown={()=>this.paintHandler(event,layer,scale)}>
                    <canvas id={getLayerId(layer)}></canvas>
                </div>
            );
        }
    },
    getStyle(layer) {
        let {scale}=this.props;
        return getLayerOffset(layer, scale);
    },
    isVisible(layer) {
        return this .props.visible !== false
            && layer.visible() !== false;
    },
    getClassName(layer) {
        return cx({
            'layer':    true,
            'is-group': layer.isGroup(),
            'is-layer': layer.isLayer(),
        });
    },

    componentDidMount() {
        let {layer}=this.props;
        let canvas = document.getElementById(getLayerId(layer));
        let context=canvas.getContext("2d");
        let {scale}=this.props;
        //判断鼠标是否按下
        let img = new Image();
        canvas.width=scale*(layer.width);
        canvas.height=scale*(layer.height);
        img.src = layer.toPng().src;
        img.onload = function () {
            context.drawImage(img, 0, 0,scale*layer.width,scale*layer.height);
        }
    },

    paintHandler(event,layer,scale) {
    let array_paint = [];
    let oEvent = event;
    let m_down=true;
    if (!layer) return defaults;
    let disX= scale*(layer.left-layer.parent.left);
    let disY=scale* (layer.top-layer.parent.top);
    let currentX = oEvent.clientX- disX -260;
    let currentY = oEvent.clientY- disY - 100;

    array_paint.push([currentX, currentY]);
    this.paint(array_paint, layer);
    document.onmousemove = (ev) => {
        if(m_down==true){
            let oEvent = ev;
            let currentX = oEvent.clientX-disX -260;
            let currentY = oEvent.clientY-disY-100 ;
            array_paint.push([currentX, currentY]);
            this.paint(array_paint, layer);

        }
    }
        document. onmouseup = (event) => {
        m_down = false;
        array_paint = [];
        document.onmousemove = null;
        document.onmouseup = null;
    }
},

    paint(array_paint,layer) {
        let {lineWidth}=this.props;
        let {lineColor}=this.props;
        let canvas = document.getElementById(getLayerId(layer));
        let context = canvas.getContext("2d");
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(array_paint[0][0],array_paint[0][1]);
        if(array_paint.length == 1) {
            context.lineTo(array_paint[0][0]+1,array_paint[0][1]+1);
        }
        else
        {
            var i =1;
            for(i in array_paint)
            {
                context.lineTo(array_paint[i][0],array_paint[i][1]);
                context.moveTo(array_paint[i][0],array_paint[i][1]);
            }

        }
        context.closePath();
        context.stroke();
    },

});
export default Layer;