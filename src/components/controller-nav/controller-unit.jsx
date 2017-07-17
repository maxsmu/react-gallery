/**
 * @author: Michael
 * @date: 2017-07-14 17:13:18
 * @last modified by: Michael
 * @last modified time: 2017-07-14 17:13:18
 * @gitHub: https://github.com/maxsmu
*/
import React, { Component } from 'react'
import './controller-nav.css'

/**
 * 控制组件
 */
export class ControllerUnit extends Component {
	state = { isInverse: true }
	/**
	 * 帮助处理
	 * @param {Event} e 
	 */
	onHandleClik = e => {
		if (this.props.image.area==='center') {
			this.props.onInverse()
			 
		} else {
			this.props.onCenter()
		}
		e.preventDefault()
		e.stopPropagation()
	}
	render() {
		const { image } = this.props

		// 样式名称
		let className = 'controller-unit'

		if (image.area==='center') {
			className = `${className} is-center iconfont icon-picLeft ${image.isInverse ? ' is-inverse' : ''}`
		}

		return (
			<span className={className} onClick={this.onHandleClik}></span>
		)
	}
}

