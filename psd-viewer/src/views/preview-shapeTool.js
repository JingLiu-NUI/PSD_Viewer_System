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
        shape: T.string,
        shapeColor: T.string,
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
                <div id={getLayerId(layer)+"div"}
                    className={this.getClassName(layer)}
                     style={this.getStyle(layer)}
                     onMouseDown={()=>this.shapeHandler(event,layer,scale)}>
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
    shapeHandler(ev,layer,scale) {
        let {shape}=this.props;
        let {shapeColor}=this.props;
        let startX = ev.clientX;
        let startY = ev.clientY;
        let setOffetDisX= scale*(layer.left-layer.parent.left);
        let setOffetDisY=scale* (layer.top-layer.parent.top);
        let offsetLeft=260+setOffetDisX;
        let offsetTop=100+setOffetDisY;
        let xz= shape;
        let oDiv= document.getElementById(getLayerId(layer)+"div");
        let shapes = document.createElement('canvas');
        let sContext=shapes.getContext("2d");
        shapes.width=0;
        shapes.height=0;
        shapes.style.position = "absolute";
        oDiv.appendChild(shapes);
        document.onmousemove  = (ev) => {
            let oEv = ev;
            let moveX = oEv.clientX;
            let moveY = oEv.clientY;
            if(moveX<offsetLeft)
            {
                moveX=offsetLeft;
            }
            else if(moveX>offsetLeft+oDiv.offsetWidth)
            {
                moveX=offsetLeft+oDiv.offsetWidth;

            }
            if(moveY<offsetTop)
            {
                moveY=offsetTop;
            }
            else if(moveY>offsetTop+oDiv.offsetHeight)
            {
                moveY=offsetTop+oDiv.offsetHeight;
            }
            let height=Math.abs(moveY - startY);
            let width = Math.abs(moveX - startX) ;
            let left = (Math.min(startX, moveX)) -offsetLeft ;
            let top = (Math.min(startY, moveY)) - offsetTop;
            shapes.width=width;
            shapes.height=height;
            shapes.style.left=left+"px";
            shapes.style.top=top+"px";
            switch (xz) {
                case 'line':
                    sContext.lineWidth = 2;
                    sContext.strokeStyle = shapeColor;
                    sContext.beginPath();
                    console.log(startX);
                    console.log(moveX);
                    if(startX<moveX&&startY<moveY) {
                        sContext.moveTo(0, 0);
                        sContext.lineTo(width, height);
                    }
                    else if(startX<moveX&&startY>moveY){
                        sContext.moveTo(0, height);
                        sContext.lineTo(width, 0);
                    }
                    else if(startX>moveX&&startY<moveY) {
                        sContext.moveTo(width,0);
                        sContext.lineTo(0,height);
                    }
                    else{
                        sContext.moveTo(width,height);
                        sContext.lineTo(0,0);
                    }
                    sContext.closePath();
                    sContext.stroke();
                    shapes.style.width=width+"px";
                    shapes.style.height=height+"px";
                    break;
                case 'circle':
                    height = Math.min(Math.abs(moveX - startX), Math.abs(moveY - startY)) ;
                    width = Math.min(Math.abs(moveX - startX), Math.abs(moveY - startY));

                    let borderRadius = (Math.min(Math.abs(moveX - startX), Math.abs(moveY - startY))) / 2 ;
                    sContext.beginPath();
                    sContext.arc(width/2,height/2,borderRadius,0,2*Math.PI);
                    sContext.fillStyle=shapeColor;
                    sContext.closePath();
                    sContext.fill();
                    shapes.style.height = height+'px';
                    shapes.style.width = width + 'px';
                    break;
                case 'rectangle':
                    height= Math.abs(moveY - startY);

                    shapes.style.height=height+"px";
                    shapes.style.width=width+"px";
                    sContext.fillStyle=shapeColor;
                    sContext.fillRect(0,0 ,width,height);
                    break;
                case 'square':
                    width=Math.min(Math.abs(moveX - startX), Math.abs(moveY - startY));
                    height=Math.min(Math.abs(moveX - startX), Math.abs(moveY - startY));
                    shapes.style.height=height+"px";
                    shapes.style.width=width+"px";
                    sContext.fillStyle=shapeColor;
                    sContext.fillRect(0,0,width,height);
            }
        }
        document.onmouseup=(event)=>{
            if(shapes.width<1&&shapes.height<1){
                oDiv.removeChild(shapes);
            }
            document.onmousemove = null;
            document.onmouseout = null;

        }
    },
});
export default Layer;
