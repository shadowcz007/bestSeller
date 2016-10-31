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
const path=require('path');
const {remote,ipcRenderer} = require('electron');

const bestdb=require(path.join(__dirname, './bestdb.js'));
const chart=require(path.join(__dirname, './myChart.js'));

function showDepartment (argument) {
	let NewBestHour=24;//取最近24小时上榜的商品
	let NewNewBs=1;

	bestdb.load("rank",'',function(data){
	//console.log(data[0].title);
	//console.log(data[0]);

	let time1=[],time2=[],title=[];//统计出现次数
	let timeS=[],timeN=[],titleS=[],dataS=[],urlS=[],imgS=[],rankS=[],starS=[],reviewS=[],priceS=[],rankSeries=[];//统计某商品排名情况
	let fdataAll=[];

	let ln=data.length;
	let counts=0;

	for (var i = data.length - 1; i >= 0; i--) {

		ln--;
console.log(data[i].time.length+'~~~~~~~~~~~~~~~~~~');
		if (data[i].time.length<=24) {
				time1.push(data[i].time.length);
				time2.push(0);
		}else{
				time1.push(0);
				time2.push(data[i].time.length);
		}

		title.push(data[i].title);




		if (data[i].time.length<=NewBestHour) {
			counts++;
			let ranks1=data[i].rank,
			    reviews1=data[i].review,
					priceMins1=data[i].priceMin,
					stars1=data[i].star,
					detail1=data[i].detail;

			let rank00=[];
		//	console.log(ranks1);
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
					//	console.log(detail1[p])
								let tp=detail1[p].time,
										rp=detail1[p].rank,
										pmp=detail1[p].priceMin,
										rep=detail1[p].review,
										sp=detail1[p].star;

								fRank.push([tp,rp]);
								fReview.push([tp,rep]);
								fPriceMin.push([tp,pmp]);
								fStar.push([tp,sp]);
								if (jln<=0) {
									fdataAll.push([fRank,fReview,fPriceMin,fStar]);
								}
	//console.log(tp);
					}

			timeS.push(dataToTime);
	//console.log("-----------------"+data[i].title);

			timeN.push(data[i].time_new);
			titleS.push(data[i].title);
			dataS.push(data[i].data);
			urlS.push(data[i].link);
			imgS.push(data[i].img);
			rankS.push(data[i].rank_new);
			reviewS.push(data[i].review_new);
			starS.push(data[i].star_new);
			priceS.push(data[i].priceMin_new+'~'+data[i].priceMax_new);



		};

		if (ln<=0) {


			//	console.log(series);
			//	console.log(titleS);
			//	console.log(timeS);

			 	console.log(title);
					console.log(time1);
						console.log(time2);

				chart.duration(title,time1,time2);

				let cln=titleS.length;
				let clna=0;

				for (let k = 0; k < cln; k++) {
					clna++;
				//	$('#lineStack').append("<div id="+'lineStack'+k+' class="lineStack"></div><a href="'+urlS[k]+'" class=lineStackTitle>'+(k+1)+':  '+titleS[k]+'</a><img class=pull-left src="'+imgS[k]+'">');
				$('#lineStack').append(
					`<li class="list-group-item">

							<div id=`+'lineStack2_'+k+` class=lineStack></div>
					    <img class="media-object pull-left" src=`+imgS[k]+` width="72" >
					    <div class="media-body">
					      <strong>`+'Product Title : '+titleS[k]+`</strong>
					      <p>`+'Url : '+urlS[k]+`</p>
								<p>`+'Rank : '+rankS[k]+`</p>
								<p>`+'Review : '+reviewS[k]+`</p>
								<p>`+'Star : '+starS[k]+`</p>
								<p>`+'Price : $'+priceS[k]+`</p>
								<p>`+'Update Time : '+timeN[k]+' , NO.'+(k+1)+`</p>
								<button class="btn btn-large btn-negative look_product" dp="clothing" data="`+dataS[k]+`">Add to Look</button>
					    </div>
					  </li>`);

					if (clna>=cln) {
						$('.look_product').on('click', function(){

								let productTitle=$(this).attr('data');
								bestdb.lookProduct(productTitle,'addList');

            });

						for (let p = 0; p < cln; p++) {
						//	console.log(JSON.stringify(fdataAll[p]));
							//chart.lineStack(p,titleS[p],timeS[p],rankSeries[p]);
							chart.lineStack2(p,titleS[p],fdataAll[p]);
						}
					}
				}
		};
	};
});

bestdb.load("rank","2016/10/25/15:50",function(data){
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
						chart.parallel(pSeries,titles,colors);
					}
		}

});

}



function showProduct() {
	 bestdb.lookProduct('look_product','all','loadProduct',function (docs) {
		 		//console.log(docs);

				let ln=docs.length;
					console.log(docs.length);
				for (var i = 0; i < docs.length; i++) {
						ln--;
console.log(docs[i]);
						let ranks=docs[i].ranks_lp,
								timeS=[],
								rankS=[],
								sln=ranks.length;

						$('#PD_lineStack').append(
							`<li class="list-group-item">
									<img class="media-object pull-left" src=`+docs[i].img+` width="72" >
									<div class="media-body">
										<strong>`+'Product Title : '+docs[i].title+`</strong>
										<p>`+'Looks : '+ranks.length+`</p>
										<p>`+'Rank : '+docs[i].rank_lp+`</p>

										<p>`+'First Date : '+docs[i].firstDate+`</p>
										<p>`+'Update : '+docs[i].time_lp+`</p>
										<p>`+'ASIN : '+docs[i].ASIN+`</p>
										<p>`+'Keywords : '+docs[i].keywords+`</p>
										<p>`+'Url : '+docs[i].link+`</p>

									</div>
									<div id=`+'PD_lineStack_'+i+'_img'+`></div>
									<div id=`+'PD_lineStack_'+i+` class=lineStack></div>
								</li>`);

						let series=[{'type':'line','data':[]},{'type':'line','data':[]},{'type':'line','data':[]},{'type':'line','data':[]}];

						for (var j = 0; j < ranks.length; j++) {
								sln--;
								rankS.push(rankSs(ranks[j].rank));
								let todu=rankSs(ranks[j].rank);
								for (var k = 0; k < todu.length; k++) {
										series[k].name=todu[k][0]
										series[k].data.push(todu[k][1])
								}
								timeS.push(ranks[j].time);
								if(sln<=0){
										console.log(series)
										chart.lineStack('PD_lineStack_'+i,docs[i].title,timeS,series);

								}
						}
					}
	 });






				function rankSs(rankS) {

					let series=[];
					let lns=rankS.length;
					for (let p = 0; p < rankS.length; p++) {
							lns--;
							let jiji=rankS[p];

							let name=jiji.replace(/.* in|\(.*|\)|\s{2}/gi,'');

							let rank=jiji.replace(/in.*|\s/g,'');

							series.push([name,rank])
							if (lns<=0) {
								 return series
							}
					}



/*
else{
		series[name].push(jiji.replace(/in.*|\s/gi,''))
		console.log(series[name]);
}
if (lns<=0) {
	let names=Object.keys(series),
			data=[],
			lnn=names.length;

	for (let u = 0; u < names.length; u++) {
					lnn--;
					let n=names[u];
					data.push({'name':n,
									 'type':'line',
									 'stack': 'rank',
									 'data':series[n]
							 });
					if (lnn<=0) {
							return data
					}
	}
}


*/











}














}




function showTReviewers() {
				bestdb.topReviewers('',function (docs) {
								console.log(docs);
								for (var i = 0; i < docs.length; i++) {
										$('#topReviewersG').append(`
												<p>`+docs[i].name+`</p>
												<p>`+docs[i].totalReviews+`</p>
												<p>`+docs[i].rank+`</p>
											`)
								}

				})
}





function getRandomColor(){
	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
}
function getRandomColor2(){
    return "red";
 }

module.exports = {
    showDepartment: showDepartment,
		showProduct:showProduct,
		showTReviewers:showTReviewers

};
