import React from "react";
import ReactDOM from "react-dom";
import {
	Upload,
	Button,
	Select,
	Menu,
	Dropdown,
	Input,
	Table,
	message,
	Icon,
	Tag
} from 'antd';
import "antd/dist/antd.css";
import "./Network.less";
import {getNetWorkData, getNetWorkChange, COMMON_HOST} from "@/fetch";
import echarts from 'echarts';
import { List, fromJS } from 'immutable';
import classNames from 'classnames';
import { isNumber } from "util";

const Option = Select.Option;

class Network extends React.Component {

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
			mountNodeShow: false,
			size: 5,
			alpha: 0.001,
			epi: 2,
			pp: 0.8,
		};
		this.myChart = {};
		let self = this;
		message.config({
			top: 100,
			duration: 6,
		});
		this.uploadProps =  {
			name: 'file',
			action: COMMON_HOST + 'upload',
			withCredentials: true,
			headers: {
			  authorization: 'authorization-text',
			},
			accept: '.txt',
			data(file) {
				return {
					size: self.state.size,
					alpha: self.state.alpha,
					epi: self.state.epi,
					pp: self.state.pp
				}
			},
			beforeUpload() {
				const filterParams = (data, lower, upper, name)  => {
					if ( data === "" ) {
						message.error(`please complete ${name} `);
						return true
					}
					data = Number( data )
					if ( isNaN( data ) ) {
						message.error(`please complete ${name} by number.`);
						return true
					}
					if ( data < lower || data > upper ) {
						message.error(`${name} must in ${lower}--${upper} !`);
						return true
					}
				}	
				
				if ( filterParams( self.state.size, 3, 10, 'population.size' ) ) {
					return false;
				}
				if ( filterParams( self.state.alpha, 0.001, 0.05, 'fast.alpha' ) ) {
					return false;
				}
				if ( filterParams( self.state.epi, 2, 3, 'k-locus' ) ) {
					return false;
				}
				if ( filterParams( self.state.pp, 0, 1, 'select-percent' ) ) {
					return false;
				}
			},
			onChange(info) {				
			  if (info.file.status === 'done') {
				message.success(`${info.file.name} file uploaded successfully`);
			  } else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			  }
			  if (info.file.response ) {
				  if ( info.file.response.status === 1 ) {
					self.startInit()
				  } else {
					let msg = info.file.response.msg
					message.error( msg )
				  }
			  } 
			},
		};
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

		getNetWorkData()
		.then( data => {
			this.setState({
				netWorkData: data,
				isDemoRun: true,
				demoDebugPath: data.debugPath
			})

			this.drawNetWrok()

			// 画布长度
			mountNode.style.height = Math.ceil( data.edgeList.length / 3 ) * 300 + 500 + 'px'

			// 持久化(只涉及到边)
			this.immutableNetWorkData = fromJS( data.edgeList )
			this.netWorkEdgeStageList = []
			this.netWorkEdgeStageList.push( this.immutableNetWorkData )

			getNetWorkChange().then( data => {
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

	drawNetWrok() {
		

		let rawData = this.state.netWorkData 
		let netWorkSeries = [],
			netWorkSeriesLen = rawData.edgeList.length,
			nodes = [], 
			edges = [],
			edge = [],
			titles = [];
		const itemColor = ['#999', '#60a6d6', '#3093d7', '#1890ff', '#1b6da6', '#096ac4', '#00529f']

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
					repulsion: 50,
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

	drawDebugBox( data, stage ) {
		let cur = this.state.debugText
		cur.push(`---------------------- stage${stage} ----------------------`)
		this.setState({
			debugText: cur.concat( data )
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
			<div className = "net" >
				<div className="upload-table">				
					<div className="text-wrap">
						<p className="desc">
						&emsp;The user should upload right format file which contains the case-control data as the input for the programme. The first line of the iput file contains the SNP IDs and the name for the reponse variable(last column).<br/>
						&emsp;The following lines are the genotype data which should be coded by 0, 1, 2 with each line corresponding to one individual.<br/>
						&emsp;The last column should contain the disease status of each individual coded by 0 and 1.<br/>
						&emsp;The following is a sample data file for 5 individuals(3 cases and 2 controls), each genotyped for 10 SNPs. And also you can download this whole file
						</p>
						<div className="table-wrap">
							<div className="u-file">
								<Tag color="blue">fast.alpha</Tag>
								<Input 
								placeholder="0.001" 
								value={this.state.alpha}
								onChange={
									e => { this.setState({ alpha: e.target.value }) }
								}/>
								<p>recommend 0.05--0.001</p>
							</div>
							<div className="u-file">
								<Tag color="geekblue">population.size</Tag>
								<Input 
									placeholder="5" 
									value={this.state.size}
									onChange={
										e => { this.setState({ size: e.target.value }) }
									}
								/>
								<p>recommend 3--10</p>
							</div>
							<div className="u-file">
								<Tag color="purple">k-locus</Tag>
								<Select
								className="selectEpi"
								defaultValue={this.state.epi}
								onChange={
									e => { this.setState({ epi: e }) }
								}
								>
									<Option value="2">2</Option>
									<Option value="3">3</Option>
								</Select>
								<p>recommend 2 or 3</p>								
							</div>
							<div className="u-file">
								<Tag color="purple" style={{"width": '195px'}}>select-percent</Tag>
								<Input 
									placeholder="0.8" 
									value={this.state.pp}
									onChange={
										e => { this.setState({ pp: e.target.value }) }
									}
								/>
								<p>recommend 0--1</p>								
							</div>
							<div className="u-file">
								<Tag color="cyan">file</Tag>
								<Upload {...this.uploadProps}>
									<Button>
									<Icon type="upload" /> Click to Upload and Run
									</Button>
								</Upload>
							</div>
						</div>
					</div>	
					<div className="demo">
							<pre>example</pre>
							<pre>N0	 N1	 N2	 N3	 N4	 N5	 N6  ...  	Class</pre>
							<pre>1	  1	  0	  1	  1	  0	  0   ...   1</pre>
							<pre>2	  1	  0	  0	  1	  1	  1   ...   1</pre>
							<pre>0	  2	  0	  1	  1	  1	  1   ...   1</pre>
							<pre>1	  1	  1	  0	  0	  0	  1   ...   1</pre>
							<pre>2	  2	  0	  0	  1	  1	  1   ...   0</pre>
							<pre>0	  1	  1	  1	  1	  0	  0   ...   0</pre>
							<pre>0	  2	  1	  0	  1	  1	  0   ...   0</pre>
							<pre>2	  1	  0	  1	  0	  0	  1   ...   0</pre>
						</div>
					
				</div>
				<div className="content">
					<div className="params">
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
		);
	}

	componentDidUpdate() {
	}
}

export default Network;

