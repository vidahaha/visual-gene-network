import React from "react";
import ReactDOM from "react-dom";
import {
	Button,
} from 'antd';
import "antd/dist/antd.css";
import "./Contact.less";


class Contact extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
		};
		
	}

	componentDidMount() {
		// eslint-disable-next-line
		let map = new BMap.Map("mapContainer"); 	
		// eslint-disable-next-line
		let point = new BMap.Point(114.364936,30.481629); 
		map.centerAndZoom(point, 18); 
		// eslint-disable-next-line
		var marker = new BMap.Marker(point);        // 创建标注    
		map.addOverlay(marker);                     // 将标注添加到地图中 	
	}

	render() {
		return ( 
			<div className = "demo" >
				<div className="content">
					<div className="item" id="fItem">
						<div className="demo-text">
							<p className="title">Questions</p>
							<p className="desc">
							For questions or comments about our database, please contact liujianxiao@mail.hzau.edu.cn or albert_yang@webmail.hzau.edu.cn
							</p>
						</div>
					</div>
					<div className="item" id="sItem">
						<div className="title">Address</div>
						<div id="mapContainer"></div> 
					</div>
				</div>
			</div>
		);
	}
}

export default Contact;

