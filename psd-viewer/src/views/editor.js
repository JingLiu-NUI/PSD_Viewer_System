/* @flow */
import React from 'react';
import PSD from 'psd';
import Layer from './editor-layer';
let T = React.PropTypes;


export default React.createClass({

	propTypes: {
		psd: T.instanceOf(PSD),
		onToggleLayer: T.func,
		onHoverLayer: T.func,
		onLeaveLayer: T.func,
	},

	getLayerTree() {
		return this.props.psd.tree();
	},

	render() {
		return (
			<div className="editor">
			{this.editorLayer()}
			</div>
		);
	},
	editorLayer(){
        if (!this.props.psd) return;
        let root = this.getLayerTree();
	return(
		<Layer
			layer={root}
    	   onHover={this.props.onHoverLayer}
		   onLeave={this.props.onLeaveLayer}
		   onToggle={this.props.onToggleLayer}
		/>
	);
	},
});