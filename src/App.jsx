/**
 * @author: Michael
 * @date: 2017-07-15 10:25:25
 * @last modified by: Michael
 * @last modified time: 2017-07-15 10:25:25
 * @gitHub: https://github.com/maxsmu
*/
import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import { GalleryStage } from './components/gallery-stage'
import imageDatas from './data/gallery-images.json'

import 'normalize.css'
import './iconFont/iconfont.css'

export default class App extends Component {
	/**
    * 将图片名转成图片路径信息
    * @param {Array} imagesArr 图片名称列表
    * @return {Array} 含有真实路径的图片对象列表
    */
	genImagesUrl(imagesArr) {
		return imagesArr.map(img => {
			img.imageURL = require(`./images/${img.fileName}`);
			return img;
		}) || [];
	}
	render() {
		const imgFigures = this.genImagesUrl(imageDatas)

		return (
			<GalleryStage images={imgFigures} />
		)
	}
}
