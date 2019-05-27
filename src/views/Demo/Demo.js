import React from "react";
import ReactDOM from "react-dom";
import {
	Button,
	Table,
	Tag,
	Menu, 
	Dropdown,
	Icon
} from 'antd';
import "antd/dist/antd.css";
import "./Demo.less";
import {getDemoData, getDemoChange, COMMON_HOST} from "@/fetch";
import echarts from 'echarts';
import { List, fromJS } from 'immutable';
import classNames from 'classnames';


class Demo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			netWorkData: null,
			changeData: [],
			nodes: [],
			itemColor: ['#999', '#60a6d6', '#3093d7', '#1890ff', '#1b6da6', '#096ac4', '#00529f'],
			isDemoRun: false,
			demoDebugPath: '',
			debugText: [],
			isFinalNodeInit: false,
			finalNodeShow: false,
			mountNodeShow: false
		};
		this.startInit = this.startInit.bind(this)
		
		this.myChart = {};
		this.listData = [{
			key: '1',
			parameters: 'fast.alpha',
			introduction: 'used to adjust the threshold of fast-iamb, the higher this paremeter, the higher false positive, and if set this paremeter too small, may occur false negative.(recommend 0.05--0.001)'
		  }, {
			key: '2',
			parameters: 'population.size',
			introduction: 'used to adjust the number of bees.(recommend 3--10)'
		}, {
			key: '3',
			parameters: 'k-locus',
			introduction: 'used to adjust the dimension of SNP-SNP interaction(recommend 2 or 3)'
		}, {
			key: '4',
			parameters: 'select-percent',
			introduction: 'used to adjust original honey source(recommend 0--1)'
		}];
		this.columns = [{
			title: 'Parameters',
			dataIndex: 'parameters',
			key: 'parameters',
			width: 150,
			render: text => <b>{text}</b>,
		}, {
			title: 'Introduction',
			dataIndex: 'introduction',
			key: 'introduction',
			width: 380,
		}]
		this.menu = (
			<Menu>
				<Menu.Item>
				<button className="b-final">final</button>
				</Menu.Item>
			</Menu>
		)
	}

	startInit() {
		let mountNode = document.getElementById("mountNode")
		let finalNode = document.getElementById('finalNode')
		this.setState({
			mountNodeShow: true
		}, () => {
			this.myChart = echarts.init( mountNode )
		})
		this.myFinalChart = echarts.init( finalNode )
		this.setState({
			isFinalNodeInit: true
		})
		
		getDemoData()
		.then( data => {
			
			this.setState({
				netWorkData: data,
				isDemoRun: true,
				demoDebugPath: data.debugPath
			}, () => {
				
			})

			this.drawNetWrok()

			// 持久化(只涉及到边)
			this.immutableNetWorkData = fromJS( data.edgeList )
			this.netWorkEdgeStageList = []
			this.netWorkEdgeStageList.push( this.immutableNetWorkData )

			getDemoChange().then( data => {
				document.getElementById("d-wrap").className = 'active'
				this.setState({
					changeData: data 
				})
				this.changeNetwork( data )
				this.menu = (						
					<Menu onClick={this.renderStageOfNetwork}>
						{					
							data.map( (v, i) => {
								return (
									<Menu.Item key={i+1}>
										<button className="smb b-normal">stage-{i + 1}</button>
									</Menu.Item>
								)
							})
						}
						<Menu.Item key={0}>
						<button className="smb b-final">Final Network</button>
						</Menu.Item>
					</Menu>
				);
			})	

		})
	}

	// 计算度数
	getNetworkValue( total, edgeList ) {
		let formatEdges = []
		let nodes = []
		edgeList.forEach( (bl, index) => { 
			let formatEdge = []
			bl.forEach( (e) => {
				formatEdge.push({
					target: e[0],
					source: e[1]
				})
			})
			formatEdges.push( formatEdge )
		})
		// 计算节点的度
		total.forEach( ( ele, index ) => {
			let value = []
			formatEdges.forEach((edges, ei) => {
				let val = 0
				edges.forEach( (edg) => {
					if ( ele === edg.target ) {
						val++
					}
					if ( ele === edg.source ) {
						val++
					}
				})
				value.push( val )
			})
			nodes.push({
				name: ele,
				value
			})
		})	

		return {
			formatEdges,
			nodes
		}
	}

	drawNetWrok() {
		

		let rawData = this.state.netWorkData 
		let netWorkSeries = [],
			netWorkSeriesLen = rawData.edgeList.length,
			nodes = [], 
			edges = [],
			edge = [],
			titles = [];
		const itemColor = this.state.itemColor

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

		})		
	
		let resValue = this.getNetworkValue( rawData.totalGene, rawData.edgeList )
		edges = resValue.formatEdges
		nodes = resValue.nodes

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
				symbolSize(val, params) {
					return val[index] * 1.6 + 8
				},
				itemStyle: {
					color(params) {
						return itemColor[ params.value[ index ] ] || '#00529f'
					}
				},
				edgeSymbol: ['arrow', 'none'],
				edgeSymbolSize: 4,
				label: {
					position: 'right',
					fontWeight: 'bold',
				},
				force: {
					repulsion: 50
				},				
			})
		})

		this.setState({
			nodes
		})

		netWorkSeries.push({
            type: 'scatter',
            data: [[0,0]],
			symbolSize: 0,
			width: '25%',
        })

		this.myChart.setOption({
			title: titles.concat([{
				text: 'Different individual network',
				left: 'center'
			}]),
			color: '#60a6d6',
			series: netWorkSeries,
			xAxis: {
				axisLabel: {show: false},
				axisLine: {show: false},
				splitLine: {show: false},
				axisTick: {show: false},
				min: -11,
				max: 1
			},
			yAxis: {
				axisLabel: {show: false},
				axisLine: {show: false},
				splitLine: {show: false},
				axisTick: {show: false},
				min: -1,
				max: 3
			}
		});

	}

	drawDebugBox( data, stage ) {
		let cur = this.state.debugText
		cur.push(`---------------------- stage${stage} ----------------------`)
		this.setState({
			debugText: cur.concat( data )
		})
	}

	blockEdegChange(s, index, edgeData, label, labelColor, isSelect = false) {
		let curEdgeData = edgeData.get(index)
		if ( isSelect ) {
			label.pop()
		}
		if ( s.type === 'nothing' ) {
			label.push({
				textAlign: 'center',
				text: `nothing to do, BIC: ${s.bic}, MIT: ${s.mit}`,	
				textStyle: {
					color:  labelColor	
				}				
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
					edgeData = edgeData.set( index, curEdgeData.push(
						fromJS([ s.edges[0], s.edges[1] ])
					) )
					break
				}
				case 'drop': {
					let curEdgeKey = curEdgeData.findKey( (val, key) => {
						return val.equals( fromJS([ s.edges[0], s.edges[1] ])) 
					}) 
					edgeData = edgeData.deleteIn( [index, curEdgeKey] )
					break
				}
				default: {break}
			}
			label.push({
				textAlign: 'center',
				text: `${s.type} ${s.edges.join('->')}, BIC: ${s.bic}, MIT: ${s.mit}`,
				textStyle: {
					color:  labelColor	
				}
			})
		}
		return {
			label,
			edgeData
		}
	}

	changeNetwork( data ) {

		const changeTime = 500

		const finalRes = this.state.netWorkData.finalRes
		let nodes = this.state.nodes
		
		data.forEach( (d, index) => {

			let netWorkSeries = [],
				edges = [], // 新的边集合
				label = [],
				edgeData = this.netWorkEdgeStageList[ this.netWorkEdgeStageList.length - 1 ],
				bDls = d.blockDelete // 是否有图要删除

				d.data.forEach( (s, index) => {	

					let labelColor = '#333'

					bDls.forEach( (bd, bdi) => {
						if ( Number(bd.block) === index + 1 ) {  // 删除该图，换新的
							let bdEdge = bd.edges.split(" ").map( s => s.split(",") )
							edgeData = edgeData.update( index, v => fromJS(bdEdge) )
						}
					})

					let bcres = this.blockEdegChange(s, index, edgeData, label, labelColor )

					label = bcres.label
					edgeData = bcres.edgeData


					// 被选中的情况
					if ( d.select.length > 0 ) {
						for ( let val of d.select ) {
							if ( Number(val.block) === index + 1 ) {
								labelColor = "#f84f4f"
								s.bic = val.bic
								s.mit = val.mit
								s.type = val.type.split(' ')[0]
								s.edges = val.type.split(' ')[1].split(',')

								let bcres = this.blockEdegChange(s, index, edgeData, label, labelColor, true )

								label = bcres.label
								edgeData = bcres.edgeData
							}
						}
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

				let resValue = this.getNetworkValue( this.state.netWorkData.totalGene, edgeData.toJS() )
				nodes = resValue.nodes
				edges.forEach( (ed, index) => {
					netWorkSeries.push({
						links: ed,
						data: nodes,
					})
				})

				//debug 	
				const wordLimit = 39
				const addStrLine = (v, limit, offsetFlag = false) => {
					if ( v <= limit ) return v
					let start = v.substring(0, limit)
					let offset = 0
					while ( v[ limit - offset - 1 ] !== ' ' && offsetFlag === true) {
						offset ++
					}
					start = v.substring(0, limit - offset )
					let end = v.substring(limit - offset, v.length)
				
					if ( end.length > limit && offsetFlag === true ) {
						end = addStrLine( end, limit )
					}			
					return start + '\n' + end
				}			
				d.rawData = d.rawData.filter( v => v !== "" )	
				d.rawData = d.rawData.map( (v,i) => {
					if (  v.includes('Due') ) {
						return  addStrLine(v, wordLimit, true) 
					}
					if ( v.includes('Individual') ) {
						return  addStrLine(v, wordLimit) 
					}
					return v 
				})			

				setTimeout(() => {
					this.myChart.setOption({
						title: label.concat([{
							text: `Different individual network {b|(stage: ${d.stage})}`,
							textStyle: {
								rich: {
									b: {
										color: 'red',
										fontSize: 18,	
										fontWeight: 'bold'
									}
								}
							}
						}]),
						series: netWorkSeries,
					}, {
						notMerge: false
					})

					this.drawDebugBox( d.rawData, d.stage )

				}, changeTime * d.stage)
				this.netWorkEdgeStageList.push( edgeData )
							
				if ( index + 1 === data.length ) {

					// final
					let finalNetWorkSeries = {}
					let finalNetWorkLength = this.netWorkEdgeStageList.length
					let self = this
					let resValue = this.getNetworkValue( this.state.netWorkData.totalGene, [finalRes.edges] )
					nodes = resValue.nodes
					edges = resValue.formatEdges

					finalNetWorkSeries = {
						name: 'final',
						type: 'graph',
						layout: 'force',
						data: nodes,
						links: edges[0],
						roam: false,
						lineStyle: {
							color: '#666',
							width: 1,
						},
						left: '0%',
						top: '0%',
						zoom: 0.8,
						width: '100%',
						height: '100%',
						symbolSize(val, params) {
							return params.name === 'Class'? 18 : val[0] * 1.6 + 8
						},
						itemStyle: {
							color(params) {
								return self.state.itemColor[ params.value[ 0 ] ] || '#00529f'
							}
						},
						edgeSymbol: ['arrow', 'none'],
						edgeSymbolSize: 4,
						label: {
							position: 'right',
							fontWeight: 'bold',
						},
						force: {
							repulsion: 50
						},		
					}

					setTimeout(() => {
						this.setState({ finalNodeShow: true })
						// document.getElementById("finalNode").className += ' show'
						this.myFinalChart.setOption({
							title: {
								text: `Final Network`,
								left: 'center',
								top: '15px',
								textStyle: {
									color: 'red'
								}
							},
							series: finalNetWorkSeries,
						})
					}, changeTime * ( d.stage + 1) )
				}

		})
	}

	renderStageOfNetwork = ( e ) => {
		e.key = Number( e.key )
		// 如果是final				
		if ( e.key === 0 ) {
			this.setState({ finalNodeShow: true })
			// document.getElementById("finalNode").className += ' show'
			return true
		}

		let nodes = this.state.nodes
		let data = this.state.changeData
		let stage = e.key 
		let d = data[ stage - 1 ]
 
		let netWorkSeries = [],
			edges = [], // 新的边集合
			label = [],
			edgeData = this.netWorkEdgeStageList[ stage - 1 ]

		d.data.forEach( (s, index) => {	

			let labelColor = '#333'
			
			let bcres = this.blockEdegChange(s, index, edgeData, label, labelColor )

			label = bcres.label
			edgeData = bcres.edgeData

			// 被选中的情况
			if ( d.select.length > 0 ) {
				for ( let val of d.select ) {
					if ( Number(val.block) === index + 1 ) {
						labelColor = "#f84f4f"
						s.bic = val.bic
						s.mit = val.mit
						s.type = val.type.split(' ')[0]
						s.edges = val.type.split(' ')[1].split(',')

						let bcres = this.blockEdegChange(s, index, edgeData, label, labelColor, true )

						label = bcres.label
						edgeData = bcres.edgeData
					}
				}
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

		let resValue = this.getNetworkValue( this.state.netWorkData.totalGene, edgeData.toJS() )
		nodes = resValue.nodes
		edges.forEach( (ed, index) => {
			netWorkSeries.push({
				data: nodes,
				links: ed			
			})
		})

		//debug 	
		const wordLimit = 39
		const addStrLine = (v, limit, offsetFlag = false) => {
			if ( v <= limit ) return v
			let start = v.substring(0, limit)
			let offset = 0
			while ( v[ limit - offset - 1 ] !== ' ' && offsetFlag === true) {
				offset ++
			}
			start = v.substring(0, limit - offset )
			let end = v.substring(limit - offset, v.length)
		
			if ( end.length > limit && offsetFlag === true ) {
				end = addStrLine( end, limit )
			}			
			return start + '\n' + end
		}			
		d.rawData = d.rawData.filter( v => v !== "" )	
		d.rawData = d.rawData.map( (v,i) => {
			if (  v.includes('Due') ) {
				return  addStrLine(v, wordLimit, true) 
			}
			if ( v.includes('Individual') ) {
				return  addStrLine(v, wordLimit) 
			}
			return v 
		})			

		this.myChart.setOption({
			title: label.concat([{
				text: `Different individual network {b|(stage: ${d.stage})}`,
				textStyle: {
					rich: {
						b: {
							color: 'red',
							fontSize: 18,	
							fontWeight: 'bold'
						}
					}
				}
			}]),
			series: netWorkSeries,
		})

		this.drawDebugBox( d.rawData, d.stage )		

	}

	render() {
		let mountNodeClass = classNames({
			'hide': this.state.finalNodeShow,
			'active': this.state.mountNodeShow
		})
		let finalNodeClass = classNames({
			'active': this.state.finalNodeShow,
			'show': this.state.finalNodeShow
		})
		
		return ( 
			<div className = "demo" >
				<div className="content">
					<div className="item" id="sItem">
						<div className="title">Introduction of parameters</div>
						<Table className="item-table" dataSource={this.listData} columns={this.columns} pagination={false} />
					</div>
					<div className="item" id="rItem">
						<div className="title">Example</div>
						<div className="params">
							<div className="tag-group">
								<Tag color="blue">fast.alpha = 0.05</Tag>
								<Tag color="geekblue">population.size = 5</Tag>
								<Tag color="purple">k-locus = 2</Tag>
								<Tag color="cyan">select-percent = 0.8</Tag>
							</div>
							<Button id="dlBt" type="primary" icon="play-circle" onClick={this.startInit}>Run!</Button>
							<Button id="dlBt" type="primary" icon="download" href="demo.txt"  download>Download Example File</Button>
							<Button disabled={!this.state.isDemoRun} id="dlBt" type="primary" icon="download" href={COMMON_HOST + this.state.demoDebugPath}>Download Debug File</Button>
							<Dropdown
							overlay={this.menu}
							trigger={['click']} 
							disabled={this.state.finalNodeShow || !this.state.isDemoRun}
							>
							<Button type="primary" icon="ordered-list"> The stage of network</Button>	
							</Dropdown>
						</div>
						<div className="demo-content">
							<div id="mountNode" className={mountNodeClass}></div>	
							<div id="finalNode" className={finalNodeClass}>
								{
									this.state.isFinalNodeInit ? 
									<Icon type="close" className="close-icon" onClick={
										e => {
											this.setState({ finalNodeShow: false})
										}
									}/> : null
								} 
							</div>	
							<div id="d-wrap">
								<p className="d-title">The detailed information:</p>
								<div id="debugBox">
									{this.state.debugText.map( (v, i) => {
										v = v.replace(/(\s\w+),(\w+),/, '$1->$2').replace(/(BIC.+)\./, ' ($1)')
										return <p key={i}>{v}</p>
									})}
								</div>	
							</div>			
						</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidUpdate() {
	}
}

export default Demo;

