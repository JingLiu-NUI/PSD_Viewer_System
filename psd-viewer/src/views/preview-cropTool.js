/* @flow */
import React from 'react';
import cx from 'react/lib/cx';
import getLayerId from '../utils/get-layer-id';
import getLayerOffset from '../utils/get-layer-offset';

let T = React.PropTypes;
let imageArr=[];
let layerArr=[];
let indexCount=1;
let num=1;
let Layer = React.createClass({
    propTypes: {
        layer: T.object,
        scale: T.number,
        maxWidth: T.number,
        maxHeight: T.number,
        index:T.number,
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
        let index=this.props.index;
        if (!this.props.layer) return false;
        let {layer}=this.props;
        let {scale} = this.props;
        let maxWidth=this.props.maxWidth;
        let maxHeight=this.props.maxHeight;
        if(layer.isLayer()){
            if(num==index){
                num=1;
                return (
                    <div id="canvasWrapper"
                         style={{maxWidth,maxHeight}}>
                    </div>
                );
            }
            else{
               num+=1;
               return null;
            }
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
    componentDidMount(){
        let {layer}=this.props;
        this.initialImg(layer);

    },
    initialImg(layer){
        let maxWidth=this.props.maxWidth;
        let maxHeight=this.props.maxHeight;
        let index=this.props.index;
        if(indexCount==index) {
            imageArr.push(layer.toPng().src);
            layerArr.push(layer);
            let canvas=document.createElement("canvas");
            let context=canvas.getContext("2d");
            canvas.width=maxWidth;
            canvas.height=maxHeight;
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.position="absolute";
            canvas.style.left=0+"px";
            canvas.style.top=0+"px";
            canvas.style.width= maxWidth+"px";
            canvas.style.height= maxHeight+"px";
            canvas.style.zIndex="1";
            document.getElementById("canvasWrapper").appendChild(canvas);
            for (let i = 0; i < indexCount; i++) {
                let layer=layerArr[i];
                let offset=layer.parent;
                let {scale}=this.props;
                let img = new Image();
                img.src = imageArr[i];
                context.drawImage(img, scale*(layer.left-offset.left), scale*(layer.top-offset.top), scale * layer.width, scale * layer.height);

            }
            context.fillStyle ='rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0,canvas.width,canvas.height);
            let top = 0,
                bottom = top + canvas.height,
                left = 0,
                right = left +canvas.width;
            let subCanvas=document.createElement("canvas");
            let subContext=subCanvas.getContext("2d");
            subCanvas.onmousedown=()=>this.cropHandler(event);
            subCanvas.width=maxWidth;
            subCanvas.height=maxHeight;
            subCanvas.style.position="absolute";
            subCanvas.style.left=0+"px";
            subCanvas.style.top=0+"px";
            subCanvas.style.width= maxWidth+"px";
            subCanvas.style.height= maxHeight+"px";
            subCanvas.style.zIndex="2";
            for (let i = 0; i < indexCount; i++) {
                let layer=layerArr[i];
                let offset=layer.parent;
                let {scale}=this.props;
                let img = new Image();
                img.src = imageArr[i];
                img.onload=function(){
                subContext.drawImage(img, scale*(layer.left-offset.left), scale*(layer.top-offset.top), scale * layer.width, scale * layer.height);
                }
            }
            document.getElementById("canvasWrapper").appendChild(subCanvas);
            this.posCropBox();
            indexCount=1;
            imageArr=[];
            layerArr=[];
        }
        else{
            imageArr.push(layer.toPng().src);
            layerArr.push(layer);
            indexCount+=1;
        }
    },

    cropHandler(ev) {
        subCanvas.width=maxWidth;
        subCanvas.height=maxHeight;
        subCanvas.style.position="absolute";
        subCanvas.style.left=0+"px";
        subCanvas.style.top=0+"px";
        subCanvas.style.width= maxWidth+"px";
        subCanvas.style.height= maxHeight+"px";
        document.onmousemove  = (ev) => {
        }
        document.onmouseup=(event)=>{
          document.onmousemove = null;
          document.onmouseout = null;
        }
    },

});
export default Layer;