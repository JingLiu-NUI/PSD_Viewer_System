/* @flow */
import React from 'react';
import getLayerId from '../utils/get-layer-id';
import getLayerOffset from "../utils/get-layer-offset";
import cx from "react/lib/cx";
let T = React.PropTypes;

let Layer = React.createClass({
    propTypes: {
        layer: T.object,
        scale: T.number,
    },
    componentDidMount() {
        console.log("ssssssssssss");
        let {layer}=this.props;
        let canvas = document.getElementById(getLayerId(layer));
        if(layer.isLayer()){
            if(canvas==null){
                return "";
            }
            else{
                let context=canvas.getContext("2d");
                let {scale}=this.props;
                let img = new Image();
                canvas.width=scale*(layer.width);
                canvas.height=scale*(layer.height);
                img.src = layer.toPng().src;
                img.onload = function () {
                    context.drawImage(img, 0, 0,scale*layer.width,scale*layer.height);
                }
            }
        }
    },
    render(){
        let {layer}=this.props;
        return (
            <div className={this.getClassName(layer)}
                 style={this.getStyle(layer)}>
                <canvas id={getLayerId(layer)}></canvas>
            </div>
        );
    },
    getStyle(layer) {
        console.log("getLayerOffset");
        let scale = this.props.scale;
        return getLayerOffset(layer, scale);
    },

    getClassName(layer) {
        return cx({
            'layer':    true,
            'is-group': layer.isGroup(),
            'is-layer': layer.isLayer(),
        });
    },

});
export default Layer;