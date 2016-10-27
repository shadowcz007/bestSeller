/////////////////////////////////
/*
* @license shadow
* Copyright (c) 2016-2020 freegarden.
*=====================================
* datashow.show(DP,)
**
**
**
**
**
**
**
**
*/
/////////////////////////////

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

	let time1=[],time2=[],title=[];//统计出现次数
	let timeS=[],timeN=[],titleS=[],urlS=[],imgS=[],rankS=[],starS=[],reviewS=[],priceS=[],rankSeries=[];//统计某商品排名情况
	let fdataAll=[];

	let ln=data.length;
	let counts=0;

	for (var i = data.length - 1; i >= 0; i--) {

		ln--;

		if (data[i].time.length<=24) {
				time1.push(data[i].time.length);
				time2.push(0);
		}else{
				time1.push(0);
				time2.push(data[i].time.length);
		}

		title.push(data[i].title);

		//data[i].detail


		if (data[i].time.length<=NewBestHour) {
			counts++;
			let ranks1=data[i].rank,
			    reviews1=data[i].review,
					priceMins1=data[i].price,
					stars1=data[i].review,
					detail1=data[i].detail;

			let rank00=[];
			console.log(ranks1);
			rankSeries.push({
						"name":data[i].title,
						"type":'line',
						"stack":'总量',
						"data":ranks1
					});
					let dataToTime=data[i].time;


					for (var j = 0; j < dataToTime.length; j++) {

							dataToTime[j]=dataToTime[j].getHours()+'h';

					}
	console.log("-----------------");
					let jln=detail1.length;
					let fRank=[],fReview=[],fPriceMin=[],fStar=[];
					for (var p = 0; p < detail1.length; p++) {
						jln--;
								let tp=detail1[p].time,
										rp=detail1[p].rank,
										pmp=detail1[p].price.replace(/\$|-.*|\s/g,''),
										rep=detail1[p].review.replace(/.*\(|\)|\s/g,''),
										sp=detail1[p].review.replace(/\(.*|\s/g,'');



								fRank.push([tp,rp]);
								fReview.push([tp,rep]);
								fPriceMin.push([tp,pmp]);
								fStar.push([tp,sp]);
								if (jln<=0) {
									fdataAll.push([fRank,fReview,fPriceMin,fStar]);
								}
	console.log(tp);
					}

			timeS.push(dataToTime);
	console.log("-----------------"+data[i].title);




			timeN.push(data[i].time_new);
			titleS.push(data[i].title);
			urlS.push(data[i].link);
			imgS.push(data[i].img);
			rankS.push(data[i].rank_new);
			reviewS.push(data[i].review_new);
			starS.push(data[i].star_new);
			priceS.push(data[i].priceMin_new+'~'+data[i].priceMax_new);



		};

		if (ln<=0) {

			//	maxTime=Math.max.apply(null, time);

			//	console.log(series);
			//	console.log(titleS);
			//	console.log(timeS);




				duration(title,time1,time2);

				let cln=titleS.length;
				let clna=0;

				for (let k = 0; k < cln; k++) {
					clna++;
				//	$('#lineStack').append("<div id="+'lineStack'+k+' class="lineStack"></div><a href="'+urlS[k]+'" class=lineStackTitle>'+(k+1)+':  '+titleS[k]+'</a><img class=pull-left src="'+imgS[k]+'">');
				$('#lineStack').append(
					`<li class="list-group-item">
							<div id=`+'lineStack'+k+` class=lineStack></div>
					    <img class="media-object pull-left" src=`+imgS[k]+` width="72" >
					    <div class="media-body">
					      <strong>`+'Product Title : '+titleS[k]+`</strong>
					      <p>`+'Url : '+urlS[k]+`</p>
								<p>`+'Rank : '+rankS[k]+`</p>
								<p>`+'Review : '+reviewS[k]+`</p>
								<p>`+'Star : '+starS[k]+`</p>
								<p>`+'Price : $'+priceS[k]+`</p>
								<p>`+'Update Time : '+timeN[k]+' , NO.'+(k+1)+`</p>
								<button class="btn btn-large btn-negative look_product" dp="clothing" data="`+titleS[k]+`">Add to Look</button>
					    </div>
					  </li>`);

					if (clna>=cln) {
						$('.look_product').on('click', function(){

								let productTitle=$(this).attr('data');
								let dp=$(this).attr('dp');
								bestdb.lookProduct(dp,productTitle,'addList');
            });

						for (let p = 0; p < cln; p++) {
							console.log(JSON.stringify(fdataAll[p]));
							//lineStack(p,titleS[p],timeS[p],rankSeries[p]);
							lineStack2(p,titleS[p],fdataAll[p]);
						}
					}
				}

//
/*
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
										lineStack(index,titleS[index],timeS[index],series[index]);
				}
*/

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


	function duration(title,time1,time2){
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

	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);

	}
	function lineStack2(index,title,dataAll){
	// 基于准备好的dom，初始化echarts实例
	        var myChart = echarts.init(document.getElementById('lineStack'+index));
					var my={axisLabel:{
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
		        }};

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
				        {gridIndex: 0, type: 'time',axisLabel:my.axisLabel},
				        {gridIndex: 1, type: 'time',axisLabel:my.axisLabel},
				        {gridIndex: 2, type: 'time',axisLabel:my.axisLabel},
				        {gridIndex: 3, type: 'time',axisLabel:my.axisLabel}
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
	        var myChart = echarts.init(document.getElementById('lineStack'+index));

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
