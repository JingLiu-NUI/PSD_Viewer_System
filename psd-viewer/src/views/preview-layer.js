/* @flow */
import React from 'react';
import cx from 'react/lib/cx';
import getLayerId from '../utils/get-layer-id';
import getLayerOffset from '../utils/get-layer-offset';
import  MoveImg from './preview-moveTool';
import TypeImg from './preview-typeTool';
import RotateImg from './preview-rotateTool';
import CropImg from './preview-cropTool';
import Paint from './preview-paintTool';
import Shape from './preview-shapeTool';
import InitialPSD from './initialPSD';
let T = React.PropTypes;

let Layer = React.createClass({
    propTypes: {
        layer: T.object.isRequired,
        scale: T.number,
        maxWidth : T.number,
        maxHeight :T.number,
        chooseTool:T.number,
        fontColor:T.string,
        fontSize:T.string,
        fontWeight:T.string,
        fontStyle: T.string,
        angle:T.string,
        lineWidth: T.number,
        lineColor: T.string,
        shape: T.string,
        shapeColor: T.string,
        currentPosition: T.func,
    },
    getInitialState() {
        return {};
    },
    setImgState(image){
        this.setState({image:image});
    },
    getDefaultProps() {
        return {
            scale: 1
        };
    },
    render() {
        let {layer} = this.props;
        let {scale} = this.props;
        let chooseTool = this.props.chooseTool;
        let fontColor = this.props.fontColor;
        let fontSize = this.props.fontSize;
        let fontWeight = this.props.fontWeight;
        let fontStyle = this.props.fontStyle;
        let angle = this.props.angle;
        let lineWidth = this.props.lineWidth;
        let lineColor = this.props.lineColor;
        let shape = this.props.shape;
        let shapeColor = this.props.shapeColor;
        let x;
        let maxWidth=this.props.maxWidth;
        let maxHeight=this.props.maxHeight;
        let index=this.props.index;
        if (layer.isRoot() || layer.isGroup()) {
            return this.renderGroup(layer);
        }else {
            if (this.isVisible(layer)){
                switch (chooseTool) {
                    case 1:
                        x = (<MoveImg layer={layer}
                                  scale={scale}
                                  currentPosition={this.props.currentPosition}/>);
                        break;
                    case 2:
                        x = <TypeImg layer={layer}
                                     scale={scale}
                                     fontColor={fontColor}
                                     fontSize={fontSize}
                                     fontWeight={fontWeight}
                                     fontStyle={fontStyle}/>
                        break;
                    case 3:
                        x= <RotateImg layer={layer}
                                      scale={scale}
                                      angle={angle}/>
                        break;
                    case 4:
                        x=<CropImg layer={layer}
                                   scale={scale}
                                   maxWidth={maxWidth}
                                   maxHeight={maxHeight}
                                   index={index}
                        />
                        break;
                    case 5:
                        x=<Paint layer={layer}
                                 scale={scale}
                                 lineWidth={lineWidth}
                                 lineColor={lineColor}/>
                        break;
                    case 6:
                        x=<Shape layer={layer}
                                 scale={scale}
                                 shape={shape}
                                 shapeColor={shapeColor}
                                 />
                        break;
                    default:
                        x=<InitialPSD layer={layer}
                               scale={scale}
                        />
                        break;
                }
                return x;
            }
           else{
                return null;

            }
        }

    },
    getStyle(layer) {
        let scale = this.props.scale;
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
    renderGroup(layer) {
     return (
            <div id={getLayerId(layer)}
                 className={this.getClassName(layer)}
                 style={{height:"0px",width:"0px"}}>
                {layer.children().reverse().map(this.renderChild)}
            </div>
        );
    },

    renderChild(layer) {
        return (
            <Layer key={getLayerId(layer)}
                   layer={layer}
                   scale={this.props.scale}
                   visible={this.isVisible(layer)}
                   chooseTool={this.props.chooseTool}
                   fontColor={this.props.fontColor}
                   fontSize={this.props.fontSize}
                   fontWeight={this.props.fontWeight}
                   fontStyle={this.props.fontStyle}
                   angle={this.props.angle}
                   lineWidth={this.props.lineWidth}
                   lineColor={this.props.lineColor}
                   shape={this.props.shape}
                   shapeColor={this.props.shapeColor}
                   currentPosition={this.props.currentPosition}
                   maxWidth={this.props.maxWidth}
                   maxHeight={this.props.maxHeight}
                   index={this.props.index}/>
        );
    },
});
export default Layer;