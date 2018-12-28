import React from "react";
import ReactDOM from "react-dom";
import {
	Button,
	Table
} from 'antd';
import "antd/dist/antd.css";
import "./Network.less";
import {getNetWorkData, getNetWorkChange} from "@/fetch";
import echarts from 'echarts';
import { List, fromJS } from 'immutable';


class Network extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			netWorkData: null,
		};
		this.myChart = {};

		getNetWorkData()
		.then( data => {
			this.setState({
				netWorkData: data
			})

			// 持久化(只涉及到边)
			this.immutableNetWorkData = fromJS( data.edgeList )
			this.netWorkEdgeStageList = []
			this.netWorkEdgeStageList.push( this.immutableNetWorkData )

			getNetWorkChange().then( data => {
				this.changeNetwork( data )
			})	

		})
	}

	drawNetWrok() {
		

		let rawData = this.state.netWorkData 
		let netWorkSeries = [],
			netWorkSeriesLen = rawData.edgeList,
			nodes = [], 
			edges = [],
			edge = [],
			titles = [];

		// 获取边
		rawData.edgeList.forEach( (bl, index) => { 
			// 配置标题
			titles.push({
				textAlign: 'center',
				text: `the graph of individual ${index+1}`,
				textStyle: {
					fontSize: 12,
					fontWeight: 'normal'
				},
				left: 17 + ( index % 3 )*33 + '%',
				top: 5 + Math.floor(index / 3) * 50 + '%',
			})

			edge = []
			bl.forEach( (ele, index) => {
				edge.push({
					target: ele[0],
					source: ele[1]
				})
			})
			edges.push( edge )
		})

		// 获取节点
		rawData.totalGene.forEach( (ele, index) => {
			nodes.push({
				name: ele,
				value: 0,
			})
		})		

		// 配置图表
		edges.forEach( (ed, index) => {
			netWorkSeries.push({
				name: 'Les Miserables',
				type: 'graph',
				layout: 'force',
				data: nodes,
				links: ed,
				roam: false,
				lineStyle: {
					color: '#666',
					width: 1,
				},
				left: 5 + ( index % 3 )*33 + '%',
				top: 18 + Math.floor(index / 3) * 50 + '%',
				zoom: 0.5,
				width: '25%',
				height: '25%',
				edgeSymbol: ['arrow', 'none'],
				edgeSymbolSize: 8,
				label: {
					position: 'right',
					fontWeight: 'bold',
				},
				force: {
					repulsion: 50
				},				
			})
		})

		this.myChart.setOption({
			title: titles.concat([{
				text: 'Different individual network',
				left: 'center'
			}]),
			color: '#60a6d6',
			series: netWorkSeries
		});

	}

	changeNetwork( data ) {
		
		data.forEach( (d, index) => {

			let netWorkSeries = [],
				edges = [], // 新的边集合
				label = [],
				edgeData = this.netWorkEdgeStageList.pop()

				d.data.forEach( (s, index) => {	

					let curEdgeData = edgeData.get(index)

					if ( s.type === 'nothing' ) {
						label.push({
							textAlign: 'center',
							text: `nothing to do, bic: ${s.bic}, mit: ${s.mit}`,						
						})
					} else {
						switch (s.type) {
							case 'reverse': {	
								let curEdgeKey = curEdgeData.findKey( (val, key) => {
									return val.equals( fromJS([ s.edges[0], s.edges[1] ])) 
								}) 	
								edgeData = edgeData.updateIn([index, curEdgeKey], val => {
									return val.reverse() 
								} )
								break
							}
							case 'add': {

								break
							}
							case 'drop': {

								break
							}
							default: {break}
						}
						label.push({
							textAlign: 'center',
							text: `${s.type} ${s.edges.join(',')}, bic :${s.bic}, mit: ${s.mit}`,
						})
					}
				})

				// 新的边
				edgeData.toJS().forEach( (bl, index) => { 
					let edge = []
					bl.forEach( (ele, index) => {
						edge.push({
							target: ele[0],
							source: ele[1]
						})
					})
					edges.push( edge )
				})

				edges.forEach( (ed, index) => {
					netWorkSeries.push({
						links: ed			
					})
				})

				setTimeout(() => {
					this.myChart.setOption({
						title: label.concat([{
							text: `Different individual network (stage: ${d.stage})`,
						}]),
						series: netWorkSeries
					})
				}, 2000 * d.stage)
				this.netWorkEdgeStageList.push( edgeData )
			
		})
	}

	render() {
		return ( 
			<div className = "App" >
				<div className="content">
					<div id="mountNode"></div>					
				</div>
			</div>
		);
	}

	componentDidUpdate() {
		this.myChart = echarts.init(document.getElementById('mountNode'))
		this.drawNetWrok()
	}
}

export default Network;

