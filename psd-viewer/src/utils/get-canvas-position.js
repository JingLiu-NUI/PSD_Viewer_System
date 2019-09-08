/* @flow */

let defaults = {
    left:  0, right:  0,
    top:   0, bottom: 0,
    width: 0, height: 0,
};

export default function(layer, scale) {
    if (!layer) return defaults;
    let offset = layer.parent || defaults;
    let width=scale * (layer.width);
    let height=scale*(layer.height);
    let canvasSize=0;
    if(width>height){
        canvasSize=width;
    }
    else{
        canvasSize=height;
    }
    return {
        left:   scale * (layer.left - offset.left),
        top:    scale * (layer.top - offset.top),
        width:  canvasSize,
        height: canvasSize,

    };
};
