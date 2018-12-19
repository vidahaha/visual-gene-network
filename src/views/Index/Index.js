import React from "react";
import ReactDOM from "react-dom";
import {
	version,
	Button
} from 'antd';
import "antd/dist/antd.css";
import "./Index.less";
import getNetWorkData from "@/fetch";
import G6 from '@antv/g6';
import '@antv/g6/build/plugin.behaviour.analysis';
import '@antv/g6/build/plugin.layout.forceAtlas2';
import '@antv/g6/build/plugin.tool.mapper';


class Index extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			netWorkData: null,
		};
		getNetWorkData()
		.then( data => {
			this.setState({
				netWorkData: data
			})			
		})
	}

	drawNetWrok() {
		// 引入力导图
		const Layout = G6.Plugins['layout.forceAtlas2'];
		const layoutParams = {
			maxIteration: 1000,
			prevOverlapping: true,
			kr: 5,
			mode: 'normal',
			barnesHut: false,
			ks: 0.1,
			dissuadeHubs: true
		};
		const layout = new Layout(layoutParams)

		// 引入图形映射
		const Mapper = G6.Plugins['tool.mapper'];
		const nodeSizeMapper = new Mapper('node', 'degree', 'size', [30, 40], {legendCfg: null});
		const nodeColorMapper = new Mapper('node', 'degree', 'color', ['#166dac', '#008cec'], {legendCfg: null}); 

		let rawData = this.state.netWorkData 
		let data = {}, nodes = [], edges = []
		rawData.edgeList[0].forEach( (ele, index) => {
			edges.push({
				id: `${index}`,
				target: ele[0],
				source: ele[1],
				directed: true  
			})
		})
		rawData.totalGene.forEach( (ele, index) => {
			nodes.push({
				id: ele,
				name: ele,
				degree: 0,
			})
		})
		data.nodes = nodes
		data.edges = edges

		// 计算节点度
		this._getDegree( data.edges, data.nodes )

		const graph = new G6.Graph({
			id: 'mountNode',
			fitView: 'autoZoom',
			plugins: [ layout, nodeSizeMapper, nodeColorMapper ],
			width: 600,
			height: 500,
			modes: {
				default: ['panCanvas']
			}
		})

		graph.node({
			label(model) {
			  return {
				fontFamily: 'PingFang SC',  // 字体
				text: model.name,  // 选择数据中的name属性作为文字内容
				fill: '#fff',  // 文字颜色
				stroke: '#777',  // 文字背景颜色
				lineWidth: 2.5,  // 文字背景宽度
				fontSize: 15  // 字体大小
			  }
			}
		})
		graph.edge({
			style(model) {
			  return{
				stroke: '#A3B1BF',
				lineWidth: 2,
				endArrow: model.directed
			  };
			}
		})

		graph.read(data);

	}

	_getDegree(edges, nodes) {
		for (let i = 0; i < edges.length; i += 1) {
			for (let j = 0; j < nodes.length; j += 1) {
				if (nodes[j].id === edges[i].source || nodes[j].id === edges[i].target ) {
					nodes[j].degree +=1 ;
				}
			}
		}
	}

	render() {
		return ( 
			<div className = "App" >
				<Button type = "primary" > Hello </Button> 
				<div id="mountNode"></div>
			</div>
		);
	}

	componentDidUpdate() {
		this.drawNetWrok()
	}
}

export default Index;

