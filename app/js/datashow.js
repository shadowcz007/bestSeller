const fs = require('fs-extra');
const path=require('path');
const {remote,ipcRenderer} = require('electron');


const bestdb=require(path.join(__dirname, './bestdb.js'));

function show (argument) {
	 
bestdb.load("clothing",function(data){
	//console.log(data[0].title);
	//console.log(data[0].time.length);

 
	let maxTime=0,time=[],title=[];
	let timeArea=[],timeS=[],titleS=[],series=[];
	let ln=data.length;
	let counts=0;
	for (var i = data.length - 1; i >= 0; i--) {
		ln--;
		time.push(data[i].time.length);
		title.push(data[i].title);
		if (data[i].time.length<=10) {
			counts++;
			let ranks1=data[i].rank;
			let rank00=[];			
			console.log(ranks1);
			series.push({
						"name":data[i].title,
						"type":'line',
						"stack":'总量',
						"data":ranks1
					});
			timeS.push(data[i].time);
			titleS.push(data[i].title);

			

		};
		
		if (ln<=0) {

				maxTime=Math.max.apply(null, time);
				console.log(series);
				console.log(titleS);
				console.log(timeS);
				duration(title,time);
				let cln=titleS.length;
				let clna=0;
				$('#lineStackChange').on("click",function(){
			　　　　	$('#lineStackChange').text('lineStackChange'+clna+'/'+titleS.length)
					lineStack(titleS[clna],timeS[clna],series[clna]);
					clna++;　　　　	
					
					if (clna>cln) {
						clna=0;
					};
				});
				








		};
	};


});


	function duration(title,time){
	// 基于准备好的dom，初始化echarts实例
	        var myChart = echarts.init(document.getElementById('duration'));

	        // 指定图表的配置项和数据
	        var option = {
	            title: {
	                text: 'bestSellers持久度'
	            },
	            tooltip: {
	            	 trigger: 'axis'
	            },
	            toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
	            legend: {
	                data:['持久度']
	            },
	            xAxis: {
	                data: title
	            },
	            yAxis: {},
	            series: [{
	                name: '排名次数',
	                type: 'bar',
	                data: time
	            }]
	        };

	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);

	}
	function lineStack(title,time,series){
	// 基于准备好的dom，初始化echarts实例
	        var myChart = echarts.init(document.getElementById('lineStack'));

	        // 指定图表的配置项和数据
	        option = {
				    title: {
				        text: title
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    legend: {
				        data:title
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
				        data: time
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: series
				};


	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);

	}

	function parallel(){
		var dataT1 = [
		    [1,55,9,56,"良"]
		];

		var dataT2 = [
		    [23,26,37,27,1.163,27,13,"优"]
		];

		var dataT3 = [
		    [61,91,45,125,0.82,34,23,"良"]
		];

		var schema = [
		    {name: 'date', index: 1, text: 'rank'},
		    {name: 'reviews', index: 1, text: 'reviews'},
		    {name: 'star', index: 6, text: 'star'},
		    {name: 'price', index: 2, text: 'price'},
		    
		    
		    {name: '等级', index: 7, text: '等级'}
		];

		var lineStyle = {
		    normal: {
		        width: 2,
		        opacity: 0.8
		    }
		};

		option = {
		    color: [
		        '#c23531', '#91c7ae', '#dd8668'
		    ],
		    legend: {
		        top: 10,
		        data: ['title1', 'title2', 'title3'],
		        itemGap: 20
		    },
		    parallelAxis: [
		        {dim: 0, name: schema[0].text, inverse: true, min:1,max:100,minInterval: 1, nameLocation: 'start'},
		        {dim: 1, name: schema[1].text},
		        {dim: 2, name: schema[2].text},
		        {dim: 3, name: schema[3].text},
		        {dim: 4, name: schema[4].text,
		        type: 'category', data: ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']}
		    ],
		    
		    parallel: {
		        left: '5%',
		        right: '13%',
		        bottom: '10%',
		        top: '20%',
		        parallelAxisDefault: {
		            type: 'value',
		            name: 'reviews',
		            nameLocation: 'end',
		            nameGap: 2,
		            nameTextStyle: {
		                fontSize: 12
		            }
		        }
		    },
		    series: [
		        {
		            name: 'title1',
		            type: 'parallel',
		            lineStyle: lineStyle,
		            data: dataT1
		        },
		        {
		            name: 'title2',
		            type: 'parallel',
		            lineStyle: lineStyle,
		            data: dataT2
		        },
		        {
		            name: 'title3',
		            type: 'parallel',
		            lineStyle: lineStyle,
		            data: dataT3
		        }
		    ]
		};
	}
	

}






module.exports = {
    show: show
    
};