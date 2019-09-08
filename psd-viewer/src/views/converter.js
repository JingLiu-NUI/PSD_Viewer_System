/* @flow */
import React from 'react';
import PSD from 'psd';
import CSSChanging from '../utils/changeCSS';
let T=React.PropTypes;
export default React.createClass({
    propTypes: {
        psd: T.instanceOf(PSD).isRequired,
        currentLeft: T.number,
        currentLayer: T.object,
        currentTop: T.number,
    },
    getInitialState() {
        return {};
    },
    render() {
        let {psd} = this.props;
        return (
            <div>
                <div className="box-html" data-type="html">
                    <div className="powers">
                        <div className="powers-drag-handle" title="Double-click to expand.">
                        </div>
                        <div className="editor-actions-left">
                            <h2 className="box-title" id="html-editor-title">HTML</h2>
                        </div>
                        <div className="editor-actions-right">
                        </div>
                    </div>
                    <div className="code-wrap">
                        <div className="CodeMirror-scroll" tabIndex="-1">
                            {this.isPSDNull(psd) ? "" : this.HTMLareaDis()}
                        </div>
                    </div>
                </div>
                <div className="box-css" data-type="css">
                    <div className="powers">
                        <div className="powers-drag-handle" title="Drag to resize.Double-click to expand.">
                        </div>
                        <div className="editor-actions-left">
                            <h2 className="box-title" id="css-editor-title"><span className="box-title-name">CSS</span>
                            </h2>
                        </div>
                        <div className="editor-actions-right">
                        </div>
                    </div>
                    <div className="code-wrap">
                        <div className="CodeMirror-scroll" tabIndex="-1">
                            {this.isPSDNull(psd) ? "" : this.CSSareaDis()}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    HTMLareaDis() {
        let preHTML = " &lt;!DOCTYPE html PUBLIC \" -//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd \"&gt <br /> &lt;html xmlns=\"http://www.w3.org/1999/xhtml \"&gt<br /> &lt;head&gt<br /> &lt;meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /&gt<br /> &lt;title&gtpsdtowebexample.psd&lt;/title&gt <br /> &lt;link href=\"styles.css\" rel=\"stylesheet\" type=\"text/css\"&gt<br /> &lt;/head&gt <br /> &lt;body&gt<br /> &lt;div id=\"background\"&gt ";
        let postHTML = " &lt;/div&gt<br /> &lt;/body&gt <br /> &lt;/html&gt";
        return (
            <div className="HTMLarea">
                <pre id="HtmlPre" dangerouslySetInnerHTML={{__html: preHTML}}/>
                <pre id="HtmlMid" dangerouslySetInnerHTML={{__html: this.HTMLConversion()}}/>
                <pre id="HtmlPost" dangerouslySetInnerHTML={{__html: postHTML}}/>
            </div>
        );
    },
    CSSareaDis() {
        return (
            <div className="CSSarea">
                <pre className="CSSPre" dangerouslySetInnerHTML={{__html: this.CSSpreConversion()}}/>
                    <pre className="CSSPost" dangerouslySetInnerHTML={{__html: this.CSSPostConversion()}}/>
                </div>

        );
    },
    isPSDNull(psd) {
        if (psd == null) {
            return true;
        }
    },
    HTMLConversion() {
        let psd = this.props.psd;
        let index = 0;
        let imgName = "";
        let restDiv = " &lt;div id= \"";
        let restDivtwo = "\"&gt&lt;img src=\"images/";
        let restDivTree = ".png\"&gt&lt;/div&gt";
        psd.tree().descendants().forEach(function (node) {
            if (node.isGroup()) return true;
            index = index + 1;
            imgName += restDiv + node.name + String(index) + restDivtwo + node.name + String(index) + restDivTree + "<br />";
        });
        return imgName;
    },
    CSSpreConversion() {
        let psd = this.props.psd;
        let maxWidth = 0;
        let maxHeight = 0;
        let preCSS = "";
        psd.tree().descendants().forEach(function (node) {
            if (node.isGroup()) return true;
            if (node.width > maxWidth) {
                maxWidth = node.width;
            }
            if (node.height > maxHeight) {
                maxHeight = node.height;
            }
        });
        preCSS = "body{<br /> margin:0;<br /> padding:0;<br />}<br />#background <br /> {<br /> left:0px;<br /> top:0px;<br /> position:relative;<br /> margin-left:auto; <br /> margin-right:auto;<br /> width:" + maxWidth + "px; <br /> height:" + maxHeight + "px; <br /> overflow:hidden;<br /> z-index:0;<br /> } ";
        return preCSS;
    },

    CSSPostConversion() {
        let psd = this.props.psd;
        let index = 0;
        let imgStyle = "";
        let newImgStyle="";
        let layerCSS = [];
        let currentLayer = this.props.currentLayer;
        let currentLeft = this.props.currentLeft;
        let currentTop = this.props.currentTop;
        psd.tree().descendants().forEach(function (node) {
            if (node.isGroup()) return true;
            imgStyle = "#" + node.name + index + "<br /> {<br /> left:" + node.left + "px;<br /> top:" + node.top + "px;<br /> position:absolute; <br /> width:" + node.width + "px;<br /> height:" + node.height + "px;<br /> z-index:" + index + ";<br />}<br />";
            layerCSS.push(imgStyle);
            index += 1;
        });
          console.log("index"+index);
          layerCSS = CSSChanging(layerCSS, psd, currentLayer, currentLeft, currentTop);
          for(let i=0;i<index;i++){
          newImgStyle += layerCSS[i];
         }
          return newImgStyle;
    },
});