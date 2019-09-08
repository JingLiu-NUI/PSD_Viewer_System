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
        angle : T.string,
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
        let angle=this.props.angle;
        if(layer.isLayer()) {
            return (
                <div className={this.getClassName(layer)}
                     style={this.getStyle(layer)}
                      onClick={()=>this.canvasRotate(layer,angle,scale)}>
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
        let {layer} = this.props;
        let canvas = document.getElementById(getLayerId(layer));
        let context = canvas.getContext("2d");
        let {scale} = this.props;
        let img = new Image();
        canvas.width = scale * (layer.width);
        canvas.height = scale * (layer.height);
        img.src = layer.toPng().src;
        img.onload = function () {
            context.drawImage(img, 0, 0, scale * layer.width, scale * layer.height);
        }
    },
       canvasRotate(layer, angle,scale){
        let canvas = document.getElementById(getLayerId(layer));
        let ctx = canvas.getContext("2d");
        let x=(scale*layer.width)/2;
        let y=(scale*layer.height)/2;
        let img = new Image();
        img.src = layer.toPng().src;
        img.onload = function () {
        ctx.clearRect(0, 0, scale * layer.width,scale * layer.height);
        ctx.translate(x,y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-x,-y);
        ctx.drawImage(img, 0, 0,  scale * layer.width,scale * layer.height);
        }
   },
});
export default Layer;