/* @flow */
import React from 'react';
import PSD from 'psd';
import Highlight from './preview-highlight';
import Layer from './preview-layer';
import Tool from './previewTool';
let T = React.PropTypes;
//propTypes is used for define object. if the object is not equal to defined type, the warning will be occurred.
export default React.createClass({
	propTypes: {
		psd: T.instanceOf(PSD).isRequired,
        highlightedLayer: T.object,
        currentPosition: T.func,
	},
	getInitialState() {
		return {};
	},
	chooseToolState(chooseTool){
		this.setState({chooseTool : chooseTool});
	},
    fontSetting(fontSize,fontColor,fontWeight,fontStyle){
		this.setState({fontSize : fontSize,
			           fontColor : fontColor,
			           fontWeight : fontWeight,
		               fontStyle : fontStyle,
		});
	},
    lineSetting(lineWidth,lineColor){
		this.setState({
			            lineWid :lineWidth,
		                lineColor :lineColor,
		});
	},
	rotateAngleState(angle){
		this.setState({Angle : angle});
	},
    shapeSetting(shape){
		this.setState({shape:shape});
		console.log(shape);
	},
    shapeColorSetting(shapeColor){
		this.setState({shapeColor:shapeColor});

	},
	getScale() {
	    let height=400;
        let width=400;
		let imageWidth = this.props.psd.tree().width;
		let scaleWidth=width / imageWidth;
		let imageHeight = this. props.psd.tree().height;
        let scaleHeight=height/imageHeight;
        if(scaleHeight>scaleWidth){
		    if (width && imageWidth > width) {
			    return width / imageWidth;
		}
		else {
			return 1;
		}}
        if(scaleWidth>scaleHeight){
            if(height&&imageHeight>height){
                return height>imageHeight;
            }
            else {
                return 1;
            }
        }
	},
	/*componentDidMount() {
        let container = this.refs.container.getDOMNode().clientWidth;
        this.setState({maxWidth : container });
	},*/
	render() {
		let {psd}=this.props;
	    return (
			<div className='preview'>
                <div className="toolbar1">
                    <Tool choosedTool={this.chooseToolState}
                          fontSetting={this.fontSetting}
					      rotateAngle={this.rotateAngleState}
					      lineSetting={this.lineSetting}
                          shapeSetting={this.shapeSetting}
                          shapeColorSetting={this.shapeColorSetting}/>
                </div>
                {this.isPSDNull(psd)? "" : this.PreviewArea()}
            </div>
		);
	},
    isPSDNull(psd){
	    if(psd==null) {
            return true;
        }
    },

    PreviewArea(){
       let {psd}=this.props;
	   let root = this.props.psd.tree();
       let scale = this.getScale();
       let height = scale * root.height;
       let width= scale*root.width;
       let {highlightedLayer}=this.props;
       let index=0;
        psd.tree().descendants().forEach(function (node){
            if(node.isGroup())  return true;
				index+=1;

		});
        return (
            <div className='preview--container'
                 style={{height,width}}>
                <div className='preview--layers'>
                    <Layer layer={root}
                           scale={scale}
                           chooseTool={this.state.chooseTool}
                           fontColor={this.state.fontColor}
                           fontSize={this.state.fontSize}
                           fontWeight={this.state.fontWeight}
                           fontStyle={this.state.fontStyle}
                           angle={this.state.Angle}
                           lineWidth={this.state.lineWid}
                           lineColor={this.state.lineColor}
                           shape={this.state.shape}
                           shapeColor={this.state.shapeColor}
                           currentPosition={this.props.currentPosition}
						   maxWidth={width}
					       maxHeight={height}
					       index={index}/>
                </div>
                <Highlight layer={highlightedLayer}
                           scale={scale}
                           chooseTool={this.state.chooseTool}/>

            </div>
        );
    },

});