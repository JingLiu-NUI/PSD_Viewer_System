/* @flow */
import PSD from 'psd';
import Preview from './preview';
import Editor from './editor';
import Converter from './converter';
import React from 'react';
export default React.createClass({
    getInitialState() {
        return ({layerCSS:null,
                  currentLeft:null,
                  currentLayer:null,
                  currentTop:null});

  },
    async uploadFile() {
       let imgURL=this.readFile();
        this.setState({ psd:null });
        let psd = await PSD.fromURL(imgURL);
        this.setState({psd: psd });
    },
    toggleLayer(layer) {

        layer.layer.visible = !layer.visible();
        this.forceUpdate();
    },
    highlightLayer(layer) {
        this.setState({ highlightedLayer: layer });
    },
    currentPosition(ccurrentLayer, ccurrentLeft, ccurrentTop){
        this.setState({currentLeft:ccurrentLeft,
                       currentTop: ccurrentTop,
                       currentLayer: ccurrentLayer});
    },
    render() {

        return (
            <div className="applicationReady">
                <div id="topBar">
                    <button id="openFile" onClick={()=>this.uploadFileDis()}>Open File</button>
                    <button id="saveFile" value="save file">Save File</button>
                    <button id="filter" value="filter">Filter</button>
                    <button id="layerEditor" value="layer editor">Layer</button>
                </div>
                {this.uploadArea()}
                {this.renderApplication()}
            </div>
        );
    },
     readFile() {
    let input = document.getElementById("myFile");
    let imgURL = "";
    try {
        let file = null;
        if (input.files && input.files[0]) {
            file = input.files[0];
        } else if (input.files && input.files.item(0)) {
            file = input.files.item(0);
        }
        try {
            imgURL = file.getAsDataURL();
        } catch (e) {
            imgURL = window.URL.createObjectURL(file);
        }
    } catch (e) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    return imgURL;
},
    uploadFileDis(){
     let uploadArea=document.getElementById("uploadArea");
     uploadArea.style.display="block";
    },
    uploadArea(){
        return (
        <div id="uploadArea">
            <input id="myFile" type="file">Choose File</input>
            <button id="upload" onClick={()=>{this.uploadFile();this.closeUploadFile()}}>upload</button>
        </div>);
    },
    closeUploadFile(){
        let uploadArea=document.getElementById("uploadArea");
        uploadArea.style.display="none";
    },
    renderApplication() {
        return (
              <div className="editorArea">
                     <Preview psd={this.state.psd}
                              highlightedLayer={this.state.highlightedLayer}
                              currentPosition={this.currentPosition}/>,
                      <Converter psd={this.state.psd}
                                 currentLeft={this.state.currentLeft}
                                 currentLayer={this.state.currentLayer}
                                 currentTop={this.state.currentTop}
                      />
                <Editor psd={this.state.psd}
                        onHoverLayer={this.highlightLayer}
                        onLeaveLayer={this.highlightLayer}
                        onToggleLayer={this.toggleLayer}/>,
                </div>
        );
    },


});