/* @flow */
import React from 'react';
import cx from 'react/lib/cx';
import getLayerId from '../utils/get-layer-id';
import getLayerOffset from '../utils/get-layer-offset';

let T = React.PropTypes;

let Layer = React.createClass({
    propTypes: {
        layer: T.object,
        scale: T.number,
        fontSize: T.string,
        fontColor: T.string,
        fontWeight:T.string,
        fontStyle: T.string,
    },

    getInitialState() {
        return {};
    },
    cacheImage() {
        let {layer} = this.props;
        if (!layer.isLayer()) return;
        this.setState({ image: layer.toPng().src });
    },

    getDefaultProps() {
        return {
            scale: 1
        };
    },
    changeStyle(fontSize,fontColor,fontWeight,fontStyle){
        this.setState({fontSize: fontSize,
                       fontColor:fontColor,
                       fontWeight : fontWeight,
                       fontStyle  : fontStyle});
    },
    render(){
        if (!this.props.layer) return false;
        let {layer}=this.props;
        let {scale}=this.props;
        if(layer.isLayer()) {
            return (
                <div className={this.getClassName(layer)}
                     id={getLayerId(layer)}
                     style={this.getStyle(layer)}
                     onMouseDown={()=>this.typeHandler(event,layer, scale)}>
                    <img src={this.state.image}/>
                </div>
            );

        }
    },
    getStyle(layer) {
        let {scale}=this.props;
        return getLayerOffset(layer, scale);
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
    componentDidMount() {
        this.cacheImage();
    },
    typeHandler(e,layer,scale){
       let oDiv=document.getElementById(getLayerId(layer));
        let x=e.clientX;
        let y=e.clientY;
            let diffX, diffY;
            let dragging = false;
            let {fontSize}=this.props;
            let {fontColor}=this.props;
            let {fontWeight}=this.props;
            let {fontStyle}=this.props
            if (e.target.className.match(/box/)) {
                dragging = true;
                if (document.getElementById("moving_box") !== null) {
                    document.getElementById("moving_box").removeAttribute("id");
                }
                e.target.id = "moving_box";
                diffX = x - e.target.offsetLeft;
                diffY = y - e.target.offsetTop;
            }
            else {
                let disX= scale*(layer.left-layer.parent.left);
                let disY=scale* (layer.top-layer.parent.top);
                let active_box = document.createElement("textarea");
                active_box.id = "active_box";
                active_box.className = "box";
                active_box.style.left = (x-disX-260)  + 'px';
                active_box.style.top = (y-disY-100)+ 'px';
                active_box.style.background = "transparent";
                active_box.style.border="dotted";
                active_box.style.position = "absolute";
                active_box.style.fontSize=fontSize+'px';
                active_box.style.fontStyle=fontStyle;
                active_box.style.fontWeight=fontWeight;
                active_box.style.color=fontColor;
                document.getElementById(getLayerId(layer)).appendChild(active_box);
                active_box = null;
            }
            document.onmousemove = (e) => {
                let disX= scale*(layer.left-layer.parent.left);
                let disY=scale* (layer.top-layer.parent.top);
                let offsetLeft=260+disX;
                let offsetTop=100+disY;
                let moveLeft=e.clientX;
                let moveTop=e.clientY;
                if(moveLeft<offsetLeft)
                {
                    moveLeft=offsetLeft;
                }
                else if(moveLeft>offsetLeft+oDiv.offsetWidth)
                {
                    moveLeft=offsetLeft+oDiv.offsetWidth;
                }
                if(moveTop<offsetTop)
                {
                    moveTop=offsetTop;
                }
                else if(moveTop>offsetTop+oDiv.offsetHeight)
                {
                    moveTop=offsetTop+oDiv.offsetHeight;
                }
                if (document.getElementById("active_box") !== null) {
                    let ab = document.getElementById("active_box");
                    ab.style.width = moveLeft - x + "px";
                    ab.style.height = moveTop - y + "px";
                }
                if (document.getElementById("moving_box") !== null && dragging) {
                    let mb = document.getElementById("moving_box");
                    mb.style.left = moveLeft - diffX + 'px';
                    mb.style.top = moveTop - diffY + 'px';
                }
            };
            document.onmouseup = (e) => {
                dragging = false;
                if (document.getElementById("active_box") !== null) {
                    var ab = document.getElementById("active_box");
                    ab.removeAttribute("id");
                    // 如果长宽均小于 3px，移除 box
                    if (ab.offsetWidth < 3 || ab.offsetHeight < 3) {
                        document.getElementById(getLayerId(layer)).removeChild(ab);
                    }
                }
            }

    },

});
export default Layer;

