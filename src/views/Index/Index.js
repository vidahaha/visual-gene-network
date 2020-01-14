import React from "react";
import ReactDOM from "react-dom";
import {
	Button,
	Carousel,
	Table
} from 'antd';
import "antd/dist/antd.css";
import "./Index.less";


class Index extends React.Component {

	constructor(props) {
		super(props);
		this.static = {
			
		}
	}

	render() {
		return ( 
			<div className = "App" >
				<div className="content">
					<div className="home-wel">
						<Carousel draggable={true} autoplay={true}>
							<div className="item"><img src="/image/pic1.png" alt=""></img></div>
							<div className="item"><img src="/image/pic2.jpg" alt=""></img></div>
							<div className="item"><img className="small" src="/image/pic3.jpg" alt=""></img></div>
							{/* <div className="item"><img src="/image/pic4.jpg" alt=""></img></div>		 */}
						</Carousel>
						<div className="wel-text">
							<p className="title">Introduction</p>
							<p className="desc">
							BnBeeEpi is built based on bnlearn R package, and aming to provide a new solution for epistasis. At first, we changed the mutual information calculator strategy according to this particular problem, then we introduced bee colony optimized algorithm to reduce false positive, and we also make MIT score as the other criterion to balance BIC score, so as to reduce false negative.
							</p>
						</div>
					</div>
					<div className="container">
						<div className="left-box">
							<div className="item">
								<div className="box-title">
									Site Map
								</div>
								<div className="box-map">
									<div id="mapView">						
									</div>  
									<div id="mapViewHide">						
									</div> 
								</div>
							</div>
							<div className="item">
								<div className="box-title">
									How to site 
								</div>
								<div className="box-text">
									{/* <h3>Conference Venue：</h3> */}
									<p>
									Chen Yang<sup>#</sup>, Hui Gao<sup>#</sup>, Xuan Yang, Suiyu Huang, Yulong Kan, Jianxiao Liu*. BnBeeEpi: An Approach of Epistasis Mining Based on Bee Colony Algorithm and Bayesian Network, 2019 (submitted)
									</p>
								</div>
							</div>
							<div className="item">
								<div className="box-title">
									Download
								</div>
								<div className="box-text">
									<a href="BnBeeEpi_1.0.tar.gz">Click here to download BnBeeEpi_1.0.tar.gz!</a>				
								</div>		
							</div>
						</div>
						<div className="right-box">
							<div className="item">
								<div className="title">
									Process of BnBeeEpi
								</div>
								<div className="text-item">
									<h3>1. Optimized markov blanket and improve the fast-iamb BN learning method</h3>
								</div>
								<div className="text-item">
									<h3>2. Using two Bayesian network scoring methods: BIC and MIT</h3>
								</div>
								<div className="text-item">
									<h3>3. The bee colony algorithm is used to optimize the learned network</h3>
								</div>
								<div className="text-item">
									<h3>4. Using scoring decomposition to deal with larger-scale network</h3>
								</div>
							</div>
							<div className="item">
								<div className="title">
									News
								</div>
								<div className="text-item">
									<h3>Our first version of BnBeeEpi is available right now!</h3>				
								</div>
								<div className="text-item">
									<h3>The recommended browsers are Chrome, Firefox, Safari, and Edge ( IE8 and earlier have poorer support and may give a lesser experience).</h3>
								</div>			
							</div>					
						</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		const appendScript = (id, src) => {
			let node = document.getElementById(id)
			let script = document.createElement("script")
			script.src = src
			node.append( script )
		}
		appendScript('mapView', 'http://rf.revolvermaps.com/0/0/7.js?i=57rrgx4wq95&amp;m=1&amp;c=007eff&amp;cr1=0006ff&amp;sx=30&amp;ds=100')
		// appendScript('mapViewHide', 'http://rf.revolvermaps.com/0/0/8.js?i=0opws7e2l4x&amp;m=0&amp;c=ff0000&amp;cr1=ffffff&amp;l=33')

	}
}

export default Index;

