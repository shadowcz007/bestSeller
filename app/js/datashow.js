/*!
* @license shadow
* Copyright (c) 2016-2020 freegarden.
*=====================================
* datashow.show(DP,)
*
*
*
*/


const fs = require('fs-extra');
const path=require('path');
const {remote,ipcRenderer} = require('electron');

const bestdb=require(path.join(__dirname, './bestdb.js'));



function show (argument) {
	let NewBestHour=24;//取最近24小时上榜的商品
	let NewNewBs=1;




bestdb.load("clothing",'',function(data){
	//console.log(data[0].title);
	//console.log(data[0].time.length);


	let maxTime=0,time=[],title=[];//统计出现次数
	let timeArea=[],timeS=[],titleS=[],urlS=[],imgS=[],series=[];//统计某商品排名情况


	let ln=data.length;
	let counts=0;

	for (var i = data.length - 1; i >= 0; i--) {

		ln--;



		time.push(data[i].time.length);

		title.push(data[i].title);

		//data[i].detail


		if (data[i].time.length<=NewBestHour) {
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
					let dataToTime=data[i].time;

					for (var j = 0; j < dataToTime.length; j++) {
							dataToTime[j]=dataToTime[j].getHours()+'h';
					}

			timeS.push(dataToTime);
			console.log(dataToTime);

			titleS.push(data[i].title);
			urlS.push(data[i].link);
			imgS.push(data[i].img);

		};

		if (ln<=0) {

				maxTime=Math.max.apply(null, time);

			//	console.log(series);
			//	console.log(titleS);
			//	console.log(timeS);

				duration(title,time);

				let cln=titleS.length;
				let clna=0;

				lineStackChange(clna);

				$('#lineStackChange').on("click",function(){
			　　　　
								clna++;　　　　
								lineStackChange(clna)
								console.log(clna);
								console.log(cln);
								if (clna>=cln-1) {
									clna=-1;
								};
				});
				function lineStackChange(index) {

										$('#lineStackChange').text('lineStackChange:'+(index+1)+' | '+titleS.length)
										$('#lineStackChangeContent').html('<br><a href="'+urlS[index]+'">'+titleS[index]+'</a><img src="'+imgS[index]+'">')
										lineStack(titleS[index],timeS[index],series[index]);
				}


		};



	};



});

bestdb.load("clothing","2016/10/25/15:50",function(data){
	//	let pallelRank=[rank,reviews,star,price,"new"];//统计排名与各项指标的关系
		let pSeries=[],titles=[],colors=[],type='last';
		let ln=data.length;
	//	console.log(data)
			for (var i = 0; i <data.length; i++) {
					ln--;
					//最近1小时上榜的商品
					if (data[i].time.length<=NewNewBs) {
							type='new';
							colors.push(getRandomColor2());
					}else{
							colors.push(getRandomColor());
					}

					titles.push(data[i].title);

					pSeries.push({'name': data[i].title,
											'type': 'parallel',
											'lineStyle': 'lineStyle',
											'data': [[data[i].rank_new,data[i].review_new,data[i].star_new,data[i].priceMax_new,data[i].priceMin_new,type]]
											});
					if (ln<=0) {
						parallel(pSeries,titles,colors);
					}
		}

});




	function duration(title,time){
	// 基于准备好的dom，初始化echarts实例
	        var myChart = echarts.init(document.getElementById('duration'));

	        // 指定图表的配置项和数据
	        var option = {
	            title: {
	                text: 'New Best Sellers',
									textStyle:{
										fontSize:18
									}
								  },
	            tooltip: {
	            	 trigger: 'axis'
	            },
	            toolbox: {
			        feature: {
			            saveAsImage: {}
								},
								dataZoom:{
									show:true
								}
			    		},
	            legend: {
	                data:['持久度']
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
				        type: 'value',
								inverse:true,
								min:1,
								max:100,
								minInterval: 1
				    },
				    series: series
				};


	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);

	}

	function parallel(data,title,color){
	//	console.log(JSON.stringify(data));
	//	console.log(title);
		var myChart1 = echarts.init(document.getElementById('parallel'));
		var schema = [
		    {name: 'rank', index: 1, text: 'rank'},
		    {name: 'reviews', index: 2, text: 'reviews'},
		    {name: 'star', index: 3, text: 'star'},
		    {name: 'priceMax', index: 4, text: 'priceMax'},
				{name: 'priceMin', index: 5, text: 'priceMin'},
		    {name: 'NewBest', index: 6, text: 'NewBest'}
		];

		var lineStyle = {
		    normal: {
		        width: 2,
		        opacity: 0.8
		    }
		};

		option = {
		    color: color,
		    legend: {
						zlevel:1,
						orient:'vertical',
						selectedMode:'multiple',
		        top: '0',
						left:'4px',
		        data: title,
		        itemGap: 8,
						textStyle:{
							fontSize:10
						}
		    },
		    parallelAxis: [
		        {dim: 0, name: schema[0].text, inverse: true, min:1,max:100,minInterval: 1, nameLocation: 'start'},
		        {dim: 1, name: schema[1].text},
		        {dim: 2, name: schema[2].text,min:0,max:5,minInterval: 1},
		        {dim: 3, name: schema[3].text},
						{dim: 4, name: schema[4].text},
		        {dim: 5, name: schema[5].text,type: 'category', data: ['new', 'last']}
		    ],

		    parallel: {
		        left: '36px',
		        right: '36px',
		        bottom: '36px',
		        top: '1024px'

		    },
		    series: data
		};

		  myChart1.setOption(option);



	}


}



function getRandomColor(){
	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
}
function getRandomColor2(){

    return "red";

 }
module.exports = {
    show: show

};
