import React, { Component } from 'react'
import './controller-nav.css'

/**
 * 控制组件
 */
export class ControllerNav extends Component {
	render() {
		const { children, ...restprops } = this.props
		return (
			<nav className="controller-nav" {...restprops}>
				{children}
			</nav>
		)
	}
}