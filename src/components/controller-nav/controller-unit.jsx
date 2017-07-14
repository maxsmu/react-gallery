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
		if (this.props.arrange.isCenter) {
			this.props.inverse()
			this.setState({
				isInverse: !this.state.isInverse
			})
		} else {
			this.props.center()
		}
		e.preventDefault()
		e.stopPropagation()
	}
	render() {
		const { arrange } = this.props

		// 样式名称
		let className = 'controller-unit'

		if (arrange.isCenter) {
			className = `${className} is-center iconfont icon-picLeft ${arrange.isInverse ? ' is-inverse' : ''}`
		}

		return (
			<span className={className} onClick={this.onHandleClik}></span>
		)
	}
}

