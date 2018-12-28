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
							<div className="item"><img src="/image/pic1.jpg" alt=""></img></div>
							<div className="item"><img src="/image/pic2.jpg" alt=""></img></div>
							<div className="item"><img src="/image/pic3.jpg" alt=""></img></div>
							<div className="item"><img src="/image/pic4.jpg" alt=""></img></div>		
						</Carousel>
						<div className="wel-text">
							<p className="title">Welcome Message</p>
							<p className="desc">
							Genome engineering is a truly revolutionary advance in biology, and has opened various new possibilities for other fields of science. We are pleased to announce that “Frontiers in Genome Engineering 2018”  will be held from October 22 to 25, 2018 in Beijing, China. The conference will offer an excellent environment for all participants to share ideas by providing stimulating talks from internationally renowned keynote speakers. Join us to discuss the newest genome engineering technologies and to learn the applications in areas ranging from agriculture to human health.
							</p>
						</div>
					</div>
					<div className="container">
						<div className="left-box">
							<div className="item">
								<div className="box-title">
									Invited Speakers
								</div>
								<div className="box-kv">
									<div className="kv-item">
										<img src="/image/k1.jpg" alt=""></img>
										<p>David R. Liu</p>
									</div>
									<div className="kv-item">
										<img src="/image/k2.jpg" alt=""></img>
										<p>David R. Liu</p>
									</div>
									<div className="kv-item">
										<img src="/image/k3.png" alt=""></img>
										<p>David R. Liu</p>
									</div>
								</div>
							</div>
							<div className="item">
								<div className="box-title">
									Site Map
								</div>
								<div className="box-map">
									<div id="mapView">
									
									</div>  
								</div>
							</div>
							<div className="item">
								<div className="box-title">
									Transportation
								</div>
								<div className="box-text">
									<h3>Conference Venue：</h3>
									<p>
									Building 1, The Institute of Genetics and Developmental Biology, Chinese Academy of Sciences
									Address: Lincui East Road, Chaoyang District, Beijing, 100101
									</p>
									<h3>Taxi cab Information from the Airport：</h3>
									<p>
									It is highly recommended that you take a taxi from the airport. They are stationed in front of the terminal and will cost approximately RMB 100 (about 15~20 USD). 
									</p>
								</div>
							</div>
						</div>
						<div className="right-box">
							<div className="item">
								<div className="title">
									Important Dates
								</div>
								<div className="text-item">
									<h3>Registration Open</h3>
									<p>March 15, 2018</p>
								</div>
								<div className="text-item">
									<h3>Abstract Submission Deadline</h3>
									<p>September 10, 2018</p>
								</div>
								<div className="text-item">
									<h3>Poster Submission Deadline</h3>
									<p>September 30, 2018</p>
								</div>
							</div>
							<div className="item">
								<div className="title">
									Important Dates
								</div>
								<div className="text-item">
									<h3>Registration Open</h3>
									<p>March 15, 2018</p>
								</div>
								<div className="text-item">
									<h3>Abstract Submission Deadline</h3>
									<p>September 10, 2018</p>
								</div>
								<div className="text-item">
									<h3>Poster Submission Deadline</h3>
									<p>September 30, 2018</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		let map = document.getElementById("mapView")
		let script = document.createElement("script")
		script.src = "http://rf.revolvermaps.com/0/0/8.js?i=5dbafy563a4&m=0&c=ff0000&cr1=ffffff&f=arial&l=33";
		map.append(script)
	}
}

export default Index;

