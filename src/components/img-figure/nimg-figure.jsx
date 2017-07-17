/**
 * @author: Michael
 * @date: 2017-07-13 17:44:37
 * @last modified by: Michael
 * @last modified time: 2017-07-13 17:44:37
 * @gitHub: https://github.com/maxsmu
*/
import React, { Component } from 'react'
import './img-figure.css'

/**
 * 图片
 */
export class ImgFigure extends Component {
	/**
	 * imgFigure 的点击处理函数
	 * @param {Event} e 
	 */
	onInverse = e => {
		if (this.props.arrange.isCenter) {
			this.props.inverse()
		} else {
			this.props.center()
		}
		e.preventDefault()
		e.stopPropagation()
	}
	render() {
		const { imageURL, title, desc } = this.props.data
		const { pos, rotate, isInverse, isCenter } = this.props.arrange

		// const inverse = this.props.inverse
		// 如果存在定位信息，则使用定位信息
		let styleObj = pos || {}

		// 如果存在旋转信息，则使用旋转
		if (rotate) {

			// 自动添加浏览器前缀
			['Moz', 'ms', 'Webkit', ''].forEach(pre => {
				styleObj[`${pre}Transform`] = `rotate(${rotate}deg)`
			})
		}
		// isInverse
		const className = isInverse ? 'img-figure is-inverse' : 'img-figure'

		if (isCenter) {
			styleObj.zIndex = 110
			styleObj.border='solid 1px #ccc'
		}
		return (
			<figure className={className} style={styleObj} onClick={this.onInverse} >
				<img src={imageURL} alt={title} />
				<figcaption>
					<h2 className="img-title">{title}</h2>
					<div className="img-back" onClick={this.onInverse}>
						<p>{desc}</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}