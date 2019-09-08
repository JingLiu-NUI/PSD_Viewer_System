/* @flow */
import React from 'react';
import cx from 'react/lib/cx';
import getLayerId from '../utils/get-layer-id';
let T = React.PropTypes;

let defaults = {
    left:  0, right:  0,
    top:   0, bottom: 0,
    width: 0, height: 0,
};

let Layer = React.createClass({
    propTypes: {
        layer: T.object,
        scale: T.number,
        currentPosition: T.func,
    },

    getInitialState() {
        let {layer}=this.props;
        if (!layer) return defaults;
        let offset = layer.parent || defaults;
        let lefst=layer.left-offset.left;
        let tosp=layer.top-offset.top;
        return ({layerLeft:lefst,layerTop:tosp});
    },

    handleChange(left,top){
        this.setState({layerLeft:left});
        this.setState({ layerTop: top});
    },
    getDefaultProps() {
        return {
            scale: 1
        };
    },

    render(){
        let {layer}=this.props;
        let {scale}=this.props;
            return (
                <div className={this.getClassName(layer)}
                     onMouseDown={() => this.moveHandler(event, layer, scale)}
                     style={this.getStyle(layer)}>
                    <canvas id={getLayerId(layer)}></canvas>
                </div>
            );
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
    getStyle(layer) {
        let {scale} = this.props;
        return this.getLayerOffset(layer, scale);
    },
    isVisible(layer) {
        return this.props.visible !== false
            && layer.visible() !== false;
    },
    getClassName(layer) {
        return cx({
            'layer':    true,
            'is-group': layer.isGroup(),
            'is-layer': layer.isLayer(),
        });
    },
  /*  componentDidMount() {
        let {layer}=this.props;
        this.cacheImage();
    },*/

    moveHandler(ev,layer,scale) {
         let oEvent = ev;
         if (!layer) return defaults;
        let offset = layer.parent || defaults;
        let left=scale*(this.state.layerLeft-offset.left);
        let top=scale*(this.state.layerTop-offset.top);
         let disX =oEvent.clientX-left ;
         let disY =oEvent.clientY-top;
         document.onmousemove = (ev) => {
             let oEvent = ev;
             let left = (oEvent.clientX - disX)/scale;
             let top = (oEvent.clientY - disY)/scale;
             this.handleChange(left, top);
         }
         document.onmouseup = () => {
             //console.log(layer);
             this.props.currentPosition(layer,this.state.layerLeft,this.state.layerTop);
             document.onmousemove = null;
             document.onmouseup = null;
         }
    },
    getLayerOffset(layer, scale){
        if (!layer) return defaults;
        let offset = layer.parent || defaults;
        let left=scale*(this.state.layerLeft-offset.left);
        let top=scale*(this.state.layerTop-offset.top);
        return {
            left:  left,
            top:   top,
            width: scale * layer.width,
            height: scale * layer.height,
        };

    },

});

export default Layer;

