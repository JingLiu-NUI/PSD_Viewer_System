/* @flow */
import getLayerID from"./get-layer-id";
import React from 'react';
let arrLayer=[];
let num=0;
let psdTemp="";
export default function CSSChanged(arr,psd, currentLayer,currentLeft,currentTop) {
    let imgStyle = "";
    let index=0;
    if(psdTemp!=psd) {
        arrLayer = arr;
        psdTemp=psd;
    }
    else if(currentLayer!=null){
        psd.tree().descendants().forEach(function (node) {
            if (node.isGroup()) return true;
            if (getLayerID(currentLayer) ==getLayerID(node)) {
                imgStyle ="#"+ node.name+ index + "<br /> {<br /> left:" + currentLeft + "px;<br /> top:" + currentTop + "px;<br /> position:absolute; <br /> width:" + node.width + "px;<br /> height:" + node.height + "px;<br /> z-index:" + index + ";<br />}<br />";
                arrLayer[index]=imgStyle;
            }
            index+=1;
        });
    }
    return arrLayer;
}
