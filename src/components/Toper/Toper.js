import React from "react";
import { NavLink } from 'react-router-dom';
import { Flex, Box } from '@rebass/grid'
import './Toper.less';

class Toper extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			navList: [
				{
					name: 'Home',
					path: '/index'
				},		
				{
					name: 'Demo',
					path: '/demo'
				},
				{
					name: 'Network',
					path: '/network'
				},
				{
					name: 'Contact',
					path: '/contact'
				},			
			]
		}
	}

	render() {
		return ( 
			<div className = "header" >
				<div className="title">
					<p>BnBeeEpi: An Approach of Epistasis Mining Based on Bee Colony Algorithm and Bayesian Network</p>
				</div>
				<Flex className="nav" alignItems="center" px={100}>
					{this.state.navList.map((v, i) => {
						return (
							<Box width={1/this.state.navList.length} px={0} key={i}>
								<NavLink 
								activeClassName="selected" 
								className="nav-item" 
								to={v.path}>
									{v.name}
								</NavLink>
							</Box>
						)
					})}
				</Flex>
			</div>
		);
	}

}

export default Toper;


