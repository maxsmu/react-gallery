/**
 * @author: Michael
 * @date: 2017-07-15 09:47:32
 * @last modified by: Michael
 * @last modified time: 2017-07-15 09:47:32
 * @gitHub: https://github.com/maxsmu
*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './gallery-stage.css'
import { ImgFigure } from '../img-figure'
import { ControllerNav, ControllerUnit } from '../controller-nav'

export class GalleryStage extends Component {
	state = {
		stageSize: {}, // 舞台大小
		images: []
	}
	/**
	 * 生成各区域显示的图片
	 * @param {number} centerIndex 图片集合居中图片的索引
	 */
	genStageArea(centerIndex) {
		// 所有图片集合
		const imgsArrangeArr = this.props.images

		// 头部区域显示的图片集合
		let imgsArrangeTopArr = []
		// 头部区域显示图片数量
		const topImgNum = Math.floor(Math.random() * 2)

		// 取一个或不取
		let topImgSpliceIndex = 0
		const imgsArrangeCenterArr = imgsArrangeArr.splice(topImgSpliceIndex, 1)

		// 标记中心区域区域
		imgsArrangeCenterArr[0].area = 'center'

		// 取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum))

		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

		// 布局位于上侧的图片
		imgsArrangeTopArr = imgsArrangeTopArr.map((img) => {
			return {
				...img,
				area: 'top'
			}
		})

		// 布局左右两侧的图片
		let i = 0
		let j = imgsArrangeArr.length
		let k = j / 2
		for (i, j, k; i < j; i++) {
			// 前半部分布局左侧，后半部分布局右侧
			if (i < k) {
				imgsArrangeArr[i].area = 'left'
			} else {
				imgsArrangeArr[i].area = 'right'
			}
		}

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])
		return imgsArrangeArr
	}
	componentDidMount() {
		// 获取舞台节点
		const stageDOM = ReactDOM.findDOMNode(this.refs.stage)
		// 获取舞台大小
		const stageSize = {
			Width: stageDOM.scrollWidth,
			Height: stageDOM.scrollHeight,
			halfWidth: stageDOM.scrollWidth / 2,
			halfHeight: stageDOM.scrollHeight / 2
		}
		const images = this.genStageArea(0)
		this.setState({ stageSize, images })
	}
	/**
     * 翻转图片
     * @param {number} index 输入当前被执行inverse操作的图片信息数组的index值
     * @return {function} 闭包函数，一个真正待执行的函数
     */
	onInverse = index => {
		return () => {
			const { images } = this.state
			images[index].isInverse = !images[index].isInverse

			this.setState({ images })
		}
	}
	/**
	 * 利用rearrange 函数，居中对应index的图片
	 * @param {number} index 需要居中的图片对应的图片信息数组的index值
	 * @return {function} 闭包函数，一个真正待执行的函数
	 */
	onCenter = index => {
		return () => {
			const { images } = this.state

			// 获取当前居中图片index
			const centerIndex = images.findIndex(img => img.area === 'center')
			// 获取当前图片的现实区域
			const currentArea = images[index].area
			// 将当前图片的显示区域赋值给之前居中图片
			images[centerIndex].area = currentArea
			// 设置当前图片显示区域为center
			images[index].area = 'center'

			this.setState({ images })
		}
	}
	render() {
		const { stageSize, images } = this.state

		// imgfigure 节点集合
		const imgFigures = []
		// 控制组件 节点集合
		const controllerUnits = []

		// 遍历图片集合
		images.forEach((img, index) => {
			imgFigures.push(<ImgFigure key={index} onInverse={this.onInverse(index)} onCenter={this.onCenter(index)} image={img} stage={stageSize} />)
			controllerUnits.push(<ControllerUnit onInverse={this.onInverse(index)} onCenter={this.onCenter(index)} image={img} key={index} />)
		});

		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<ControllerNav>
					{controllerUnits}
				</ControllerNav>
			</section>
		)
	}
}
