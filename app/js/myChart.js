//////
let mytoolBox={
	feature: {
		dataView : {show: true,
		optionToContent: function(opt) {
				var axisData = opt.xAxis[0].data;
				var series = opt.series;
				var table = '<table style="width:100%;text-align:center"><tbody><tr>'
										 + '<td>Product Name</td>'
										 + '<td>' + series[0].name + '</td>'
										 + '<td>' + series[1].name + '</td>'
										 + '</tr>';
				for (var i = 0, l = axisData.length; i < l; i++) {
						table += '<tr>'
										 + '<td>' + axisData[i] + '</td>'
										 + '<td>' + series[0].data[i] + '</td>'
										 + '<td>' + series[1].data[i] + '</td>'
										 + '</tr>';
				}
				table += '</tbody></table>';
				return table;
		}},
			saveAsImage: {show: true,pixelRatio:2}
		}
};
let mytoolBox2={
	feature: {
		dataView : {show: true},
			saveAsImage: {show: true,pixelRatio:2}
		}
};

var myAxisLabel={
      rotate:15,
      formatter: function (value, index) {
          // 格式化成月/日，只在第一个刻度显示年份
          var date = new Date(value);
          var texts = [date.getDate(),(date.getHours() + 1)];
          if (index === 0) {
              texts.unshift(date.getMonth()+1+"M");
          }
          return texts.join(':');
      },
      textStyle:{
          fontSize:10
      }
  };

	function duration(title,time1,time2){
	// 基于准备好的dom，初始化echarts实例
					function pieData(title,time){
						var newData=[];
						for (var i = title.length - 1; i >= 0; i--) {
								newData.push({
									 'name':title[i],
									 'value':time[i]
								})
						};
						return newData
					}
					var pdTime1=pieData(title,time1),
					 		pdTime2=pieData(title,time2);

	        var myChart = echarts.init(document.getElementById('duration')),
							myChart2= echarts.init(document.getElementById('duration_pie'));

	        // 指定图表的配置项和数据
	        var option = {
	            title: {
	                text: 'New Best Sellers',
									textStyle:{
										fontSize:18
									}
								  },
	            tooltip: {
								enterable:true,
			 					trigger: 'axis',
								 //formatter: '{a0}:{b0}:{c0}<hr>{a1}:{b1}:{c1}'
	            },
								dataZoom: [
					        {
					            type: 'slider',
					            show: true,
					            xAxisIndex: [0],
					            start: 1,
					            end: 100
					        },
					        {
					            type: 'inside',
					            xAxisIndex: [0],
					            start: 1,
					            end: 100
					        }
					    ],
	            toolbox: mytoolBox,
	            legend: {
	                data:['less','more']
	            },
	            xAxis: {
									type:'category',
	                data: title,

									axisLabel:{
										interval:1,
										rotate:18,
										textStyle:{
											fontSize:8
										}
									}
	            },
	            yAxis: {type:'value'},
	            series: [{
	                name: 'less',
	                type: 'bar',
	                data: time1
	            },{
	                name: 'more',
	                type: 'bar',
	                data: time2
	            }]
	        };

					option2 = {
											tooltip: {
											 trigger: 'item',
											 formatter: "{a} <br/>{b}: {c} ({d}%)"
											},
											series: [{
											 name:'-----',
											 type:'pie',
											 radius: ['70%', '90%'],
											 avoidLabelOverlap: false,
											 label: {
													 normal: {
															 show: false,
															 position: 'center'
													 },
													 emphasis: {
															 show: true,
															 textStyle: {
																	 fontSize: '24',
																	 fontWeight: 'bold',
																	 color:'black'
															 }
													 }
											 },
											 labelLine: {
													 normal: {
															 show: false
															 }
											 },
											 data:pdTime2.sort(function (a, b) { return a.value - b.value})
									 },
									 {
											 name:'-----',
											 type:'pie',
											 radius: ['40%', '50%'],
											 avoidLabelOverlap: false,
											 label: {
													 normal: {
															 show: false,
															 position: 'center'
													 },
													 emphasis: {
															 show: true,
															 textStyle: {
																	 fontSize: '24',
																	 fontWeight: 'bold',
																	 color:'black'
															 }
													 }
											 },
											 labelLine: {
													 normal: {
															 show: false
															 }
											 },
											 data:pdTime1.sort(function (a, b) { return a.value - b.value})
									 }
									]
								};

	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
					myChart2.setOption(option2);

	}
	function duration2(department,reviewSumData,priceSumData){
	// 基于准备好的dom，初始化echarts实例


	        var myChart = echarts.init(document.getElementById('duration')) ;

		option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        }
		    },
		    legend: {
		        data: department
		    },
				dataZoom: [
					{
							type: 'slider',
							show: true,
							xAxisIndex: [0],
							start: 1,
							end: 100
					},
					{
							type: 'inside',
							xAxisIndex: [0],
							start: 1,
							end: 100
					},
					{
							type: 'slider',
							show: true,
							yAxisIndex: [0],
							start: 1,
							end: 100
					},
					{
							type: 'inside',
							yAxisIndex: [0],
							start: 1,
							end: 100
					}
			],
			toolbox: mytoolBox,
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'value'
		    },
		    yAxis: {
		        type: 'category',
		        data: department
		    },
		    series: [
		        {		name:'reviewSum',
		            type: 'bar',
		            data: reviewSumData
		        },
						{		name:'priceSum',
		            type: 'bar',
		            data: priceSumData
		        },
		    ]
		};

	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);


	}

	function lineStack2(index,title,dataAll){
	// 基于准备好的dom，初始化echarts实例
	        var myChart = echarts.init(document.getElementById('lineStack2_'+index));


					option = {
				    title: {
				        text: title,
				        x: 'left',
				        y: 0
				    },
				    grid: [
				        {x: '7%', y: '8%', width: '38%', height: '38%'},
				        {x2: '7%', y: '8%', width: '38%', height: '38%'},
				        {x: '7%', y2: '7%', width: '38%', height: '38%'},
				        {x2: '7%', y2: '7%', width: '38%', height: '38%'}
				    ],
						toolbox: mytoolBox2,
				    tooltip: {
				        formatter: ' {a}: ({c})'
				    },
				    xAxis: [
				        {gridIndex: 0, type: 'time',axisLabel:myAxisLabel},
				        {gridIndex: 1, type: 'time',axisLabel:myAxisLabel},
				        {gridIndex: 2, type: 'time',axisLabel:myAxisLabel},
				        {gridIndex: 3, type: 'time',axisLabel:myAxisLabel}
				    ],
				    yAxis: [
				        {gridIndex: 0, min: 1,max:100,inverse:true,name:"Rank",nameLocation:'start'},
				        {gridIndex: 1, min: 0,name:"Reviews",nameLocation:'end'},
				        {gridIndex: 2, min: 0,name:"PriceMin",nameLocation:'end'},
				        {gridIndex: 3, min: 0,max:5,name:"Star",nameLocation:'end'}
				    ],

				    dataZoom: [
				        {
				            type: 'slider',
				             show: false,
				            xAxisIndex: [0],
				            start: 1,
				            end: 100
				        },

				        {
				            type: 'inside', show: false,
				            xAxisIndex: [0],
				            start: 1,
				            end:100
				        },{
				            type: 'slider',
				             show: false,
				            xAxisIndex: [1],
				            start: 1,
				            end:100
				        },

				        {
				            type: 'inside', show: false,
				            xAxisIndex: [1],
				            start: 1,
				            end: 100
				        },
				        {
				            type: 'slider',
				             show: false,
				            xAxisIndex: [2],
				            start: 1,
				            end: 100
				        },

				        {
				            type: 'inside', show: false,
				            xAxisIndex: [2],
				            start: 1,
				            end: 100
				        },
				        {
				            type: 'slider',
				            show: false,
				            xAxisIndex: [3],
				            start: 1,
				            end: 100
				        },

				        {
				            type: 'inside', show: false,
				            xAxisIndex: [3],
				            start: 1,
				            end: 100
				        }

				    ],
    series: [
        {
            name: 'rank',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: dataAll[0]
        },
        {
            name: 'reviews',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: dataAll[1]
        },
        {
            name: 'priceMin',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: dataAll[2]

        },
        {
            name: 'star' ,
            type: 'line',
            xAxisIndex: 3,
            yAxisIndex: 3,
            data: dataAll[3]

        }
    ]
};

	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);

	}

	function lineStack(index,title,time,series){
	// 基于准备好的dom，初始化echarts实例
	        var myChart = echarts.init(document.getElementById(index));
          let title2=[];
          for (var i = 0; i < series.length; i++) {
            title2.push(series[i].name)
          }
	        // 指定图表的配置项和数据
	        option = {
				    title: {
				        text:''
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    legend: {
				        data:title2,
								right:'4%',
								top:'14%',
								orient:'vertical'
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: time,
                axisLabel:myAxisLabel
				    },
				    yAxis: {
				        type: 'value',
								inverse:true,
								min:1,
								minInterval: 2
				    },
				    series: series
				};


	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
					var imgSrc = myChart.getDataURL({
					    pixelRatio: 1,
					    backgroundColor: '#fff'
					});
					//console.log(document.getElementById(index+'_img'))
					$('#'+index+'_img').append(`
						<img src=`+imgSrc+` class='chartImg' style='display:none;width:90%;height: auto;'>
						`)


	}



function parallel(data,title,color,typeData){
	//	console.log(JSON.stringify(data));
	//	console.log(title);
		var myChart1 = echarts.init(document.getElementById('parallel'));
		var schema = [
		    {name: 'rank', index: 1, text: 'rank'},
		    {name: 'reviews', index: 2, text: 'reviews'},
		    {name: 'star', index: 3, text: 'star'},
		    {name: 'priceMax', index: 4, text: 'priceMax'},
				{name: 'priceMin', index: 5, text: 'priceMin'},
		    {name: 'department', index: 6, text: 'department'}
		];

		var lineStyle = {
		    normal: {
		        width: 2,
		        opacity: 0.6
		    }
		};

		option = {
		    color: color,
/*
			  legend: {
						zlevel:1,
						orient:'vertical',
						selectedMode:'multiple',
		        top: '0',
						left:'4px',
		        data: typeData,
		        itemGap: 8,
						textStyle:{
							fontSize:10
						}
		    },
*/
				toolbox: mytoolBox2,
				tooltip: {
						 padding: 10,
						 backgroundColor: '#222',
						 borderColor: '#777',
						 borderWidth: 1,
						 formatter: function (obj) {
								 var value = obj[0].value;
								 return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
										 + obj[0].seriesName + ' ' + value[0] + '日期：'
										 + value[7]
										 + '</div>'
										 + schema[1].text + '：' + value[1] + '<br>'
										 + schema[2].text + '：' + value[2] + '<br>'
										 + schema[3].text + '：' + value[3] + '<br>'
										 + schema[4].text + '：' + value[4] + '<br>'
										 + schema[5].text + '：' + value[5] + '<br>'
										 + schema[6].text + '：' + value[6] + '<br>';
						 }
				 },

		    parallelAxis: [
		        {dim: 0, name: schema[0].text, inverse: true, min:1,max:100,minInterval: 1, nameLocation: 'start'},
		        {dim: 1, name: schema[1].text},
		        {dim: 2, name: schema[2].text,min:0,max:5,minInterval: 1},
		        {dim: 3, name: schema[3].text},
						{dim: 4, name: schema[4].text},
		        {dim: 5, name: schema[5].text,type: 'category', data: typeData,axisLabel:{

							formatter: function (value, index) {
													let array=value.replace('-',' , ');

											    return array;
											}
						}}
		    ],

		    parallel: {
		        left: '36px',
		        right: '300px',
		        bottom: '36px',
		        top: '88px'

		    },
		    series: data
		};
		  myChart1.setOption(option);
	}

function scatter(maxData,minData) {
		var myChart1 = echarts.init(document.getElementById('scatter'));
		option = {
						tooltip : {
								trigger: 'axis',
								showDelay : 0,
								axisPointer:{
										show: true,
										type : 'cross',
										lineStyle: {
												type : 'dashed',
												width : 1
										}
								},
								zlevel: 1
						},
						legend: {
								data:['priceMax','priceMin']
						},
						toolbox: {
								show : true,
								feature : {
										mark : {show: true},
										dataZoom : {show: true},
										dataView : {show: true, readOnly: false},
										restore : {show: true},
										saveAsImage : {show: true}
								}
						},
						xAxis : [
								{		name:'价格',
										type : 'value',
										scale:true,

								}
						],
						yAxis : [
								{		name:'销量/reviews',
										type : 'value',
										scale:true
								}
						],
						series : [
								{
										name:'priceMax',
										type:'scatter',
										large: true,
										symbolSize: 3,
										data:maxData
								},
								{
										name:'priceMin',
										type:'scatter',
										large: true,
										symbolSize: 2,
										data: minData
								}
						]
						};

						  myChart1.setOption(option);

							var imgSrc = myChart1.getDataURL({
							    pixelRatio: 1,
							    backgroundColor: '#fff'
							});
							//console.log(document.getElementById(index+'_img'))
							$('#scatter').after(`
								<img src=`+imgSrc+` class='chartImg' style='display:none;width:90%;height: auto;'>
								`)


}

module.exports = {
    lineStack: lineStack,
    lineStack2:lineStack2,
    parallel:parallel,
    duration:duration,
		duration2:duration2,
		scatter:scatter


};
