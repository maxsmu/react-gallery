/**
 * @author: Michael
 * @date: 2017-07-13 17:44:37
 * @last modified by: Michael
 * @last modified time: 2017-07-13 17:44:37
 * @gitHub: https://github.com/maxsmu
*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './img-figure.css'

/**
 * 图片
 */
export class ImgFigure extends Component {
	Contant = {
		centerPos: {
			left: 0,
			right: 0
		},
		// 水瓶方向的取值范围
		hPosRange: {
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		// 垂直方向的取值范围
		vPosRange: {
			x: [0, 0],
			topY: [0, 0]
		}
	}
	Figure = {}
	state = {
		arrange: {}
	}
	/**
	 * imgFigure 的点击处理函数
	 * @param {Event} e 
	 */
	onHandleClick = e => {
		if (this.state.arrange.isCenter) {
			this.props.onInverse()
		} else {
			this.props.onCenter()
		}
		e.preventDefault()
		e.stopPropagation()
	}
	/**
     * 获取区间内随机值
     * @param {number} low 下区间值
     * @param {number} hight 上区间值
     */
	getRangeRandom(low, hight) {
		return Math.ceil(Math.random() * (hight - low) + low)
	}
	/**
	 * 获取 -30°到30° 之间任一值
	 */
	get30Degrandom() {
		return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
	}
	/**
	 * 获取布局信息
	 * @param {object} img 图片信息
	 * @return {object} 布局信息
	*/
	genArrange(img) {
		const { centerPos, vPosRange, hPosRange } = this.Contant
		let arrange
		switch (img.area) {
			case 'top':

				// 布局位于上侧的图片
				arrange = {
					rotate: this.get30Degrandom(),
					pos: {
						top: this.getRangeRandom(vPosRange.topY[0], vPosRange.topY[1]),
						left: this.getRangeRandom(vPosRange.x[0], vPosRange.x[1])
					},
					isCenter: false,
					isInverse: false
				}
				break
			case 'center':

				// 首先居中 centerIndex 的图片
				// 居中的图片不需要旋转
				// 设置居中图片标记
				arrange = {
					pos: centerPos,
					rotate: 0,
					isCenter: true,
					isInverse: img.isInverse
				}
				break
			case 'left':
				arrange = {
					rotate: this.get30Degrandom(),
					pos: {
						top: this.getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
						left: this.getRangeRandom(hPosRange.leftSecX[0], hPosRange.leftSecX[1])
					},
					isCenter: false,
					isInverse: false
				}
				break
			case 'right':
				arrange = {
					rotate: this.get30Degrandom(),
					pos: {
						top: this.getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
						left: this.getRangeRandom(hPosRange.rightSecX[0], hPosRange.rightSecX[1])
					},
					isCenter: false,
					isInverse: false
				}
				break
			default:
				break
		}
		this.setState({ arrange })
	}
	/**
	 * 根据props中的stage生成Contant
	 * @param {object} newProps props
	 */
	genContant(newProps) {
		// stage 画布节点 size
		const { stage } = newProps
		// figure 图片节点 size
		const figure = this.Figure
		// 计算中心图片的位置点
		this.Contant.centerPos = {
			left: stage.halfWidth - figure.halfWidth,
			top: stage.halfHeight - figure.halfHeight
		}

		// 计算水平方向的位置点 (左侧区域、右侧区域)
		this.Contant.hPosRange = {
			leftSecX: [-figure.halfWidth, (stage.halfWidth - figure.halfWidth * 3)],
			rightSecX: [(stage.halfWidth + figure.halfWidth), (stage.Width - figure.halfWidth)],
			y: [-figure.halfHeight, stage.Height - figure.halfHeight]
		}

		// 计算垂直方向位置点 （上侧区域））
		this.Contant.vPosRange = {
			x: [stage.halfWidth - figure.Width, stage.halfWidth],
			topY: [-figure.halfHeight, (stage.halfHeight - figure.halfHeight * 3)]
		}
	}
	componentDidMount() {
		// 获取figure DOM节点
		const figureDOM = ReactDOM.findDOMNode(this.refs.imgFigure)
		// 获取figure size
		this.Figure = {
			Width: figureDOM.scrollWidth,
			Height: figureDOM.scrollHeight,
			halfWidth: figureDOM.scrollWidth / 2,
			halfHeight: figureDOM.scrollHeight / 2
		}
		this.genContant(this.props)
		this.genArrange(this.props.image)
	}
	componentWillReceiveProps(nextProps) {
		this.genArrange(nextProps.image)
	}
	render() {
		const { image } = this.props
		// 获取图片基础信息
		const { imageURL, title, desc } = image

		const { arrange } = this.state
		// 获取图片排序、旋转、居中 等设置
		const { pos, rotate, isCenter, isInverse } = arrange
		let styleObj = {}

		// 判断是否存在布局，有则使用
		if (pos) {
			styleObj = pos
		}

		// 如果存在旋转信息，则使用旋转
		if (rotate) {

			// 自动添加浏览器前缀
			['Moz', 'ms', 'Webkit', ''].forEach(pre => {
				styleObj[`${pre}Transform`] = `rotate(${rotate}deg)`
			})
		}
		// 如果该图片位于居中区域，则添加样式
		if (isCenter) {
			styleObj.zIndex = 110
			styleObj.border = 'solid 1px #ccc'
		}
		// isInverse
		const className = isInverse ? 'img-figure is-inverse' : 'img-figure'

		return (
			<figure ref="imgFigure" className={className} style={styleObj} onClick={this.onHandleClick} >
				<img src={imageURL} alt={title} />
				<figcaption>
					<h2 className="img-title">{title}</h2>
					<div className="img-back" onClick={this.onHandleClick}>
						<p>{desc}</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}