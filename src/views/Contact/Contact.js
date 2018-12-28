import React from "react";
import ReactDOM from "react-dom";
import {
	Button,
	Table,
	List
} from 'antd';
import "antd/dist/antd.css";
import "./Contact.less";


class Contact extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
		};
		this.listData = [
			'Racing car sprays burning fuel into crowd.',
			'Japanese princess to wed commoner.',
			'Australian walks 100km after outback crash.',
			'Man charged over missing wedding girl.',
			'Los Angeles battles huge wildfires.',
		  ];
	}

	render() {
		return ( 
			<div className = "demo" >
				<div className="content">
					<div className="item" id="fItem">
						<img src="/image/pic1.jpg"></img>
						<div className="demo-text">
							<p className="title">Input Format</p>
							<p className="desc">
							Genome engineering is a truly revolutionary advance in biology, and has opened various new possibilities for other fields of science. We are pleased to announce that “Frontiers in Genome Engineering 2018”  will be held from October 22 to 25, 2018 in Beijing, China. The conference will offer an excellent environment for all participants to share ideas by providing stimulating talks from internationally renowned keynote speakers. Join us to discuss the newest genome engineering technologies and to learn the applications in areas ranging from agriculture to human health.
							</p>
							<div className="download">
								<p>Download Example File</p>
								<Button id="dlBt" type="primary" icon="download">Download</Button>
							</div>
						</div>
					</div>
					<div className="item" id="sItem">
						<div className="title">Introduction of parameters</div>
						<List
							header={<div>Header</div>}
							footer={<div>Footer</div>}
							bordered
							dataSource={this.listData}
							renderItem={item => (<List.Item>{item}</List.Item>)}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Contact;

