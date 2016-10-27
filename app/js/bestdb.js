/////////////////////////////////
/*
**数据库接口
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

const fs=require('fs-extra');
const path=require('path');

// mongoose config
var _connectDB="bestSellers";
var mongoose = require('mongoose')
  , connectionString = 'mongodb://localhost/'+_connectDB
  , options = {};
options = {
  server: {
    auto_reconnect: true,
    poolSize: 10
  }
};
mongoose.Promise = global.Promise;
mongoose.connect(connectionString, options, function(err, res) {
  if(err) {
    console.log('[mongoose log] Error connecting to: ' + connectionString + '. ' + err);
  } else {
    console.log('[mongoose log] Successfully connected to: ' + connectionString);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function callback () {
	console.log('mongoose open success');
});
var Schema=mongoose.Schema;


function load(DP,date,callback){
    var model= require(path.join(`${__dirname}`,'../js/model/'+DP+'.js'));

      if (DP=="look_product") {
          model.find({}, function (err, docs) {
                // docs 此时只包含文档的部分键值
                return callback(docs)

              });


      }else{

          var date1;
          if (!date) {
            date1=new Date("1990/01/01");
          }else{
            var date1=new Date(date);
          }


          model.find({time_new:{$gt: date1}}, function (err, docs) {
            // docs 此时只包含文档的部分键值
            return callback(docs)

          });

      }


}


function update(DP,counts,data) {

	//loadPath(DP,'data/'+DP+'/'+counts+'/',updateRank);
	updateRank(DP,'',data);

  function updateRank(){
  //console.log(arguments[0])
  	var bs_base=arguments[1];
   	var data=arguments[2];
    var _collecting="rank_"+arguments[0];

    var model= require(path.join(`${__dirname}`,'../js/model/'+arguments[0]+'.js'));

    let bs_base_old=[],
    	bs_new=[],
    	bs_all=[];

    //console.log(data[99].title)


    for (var i = data.length - 1; i >= 0; i--) {
    	let title0=data[i].title;
    	let rank0=parseInt(data[i].rank);

    	let time0=data[i].time;
    	let link0=data[i].link,
    	    img0=data[i].img,
	 		price0=data[i].price,
      priceMax_new=data[i].price.replace(/.*\$/g,''),
      priceMin_new=data[i].price.replace(/\$|-.*|\s/g,''),
      review_new=data[i].review.replace(/.*\(|\)/g,''),
      star_new=data[i].review.replace(/\(.*/g,''),
	 		review0=data[i].review;

    	let newTitle = {'title':title0,
    					'rank':rank0,
    					'time':time0,
    					'link':link0,
    					'img':img0,
    					'price':price0,
    					'review':review0,

              'rank_new':rank0,
              'priceMax_new':priceMax_new,
              'priceMin_new':priceMin_new,
              'review_new':review_new,
              'star_new':star_new,
              'time_new':time0,
    					'detail':{
						     	'price':price0,
						     	'rank':rank0,
						     	'time':time0,
						     	'review':review0
						     }
    				};
    	let findTitle={'title':title0};
		model.findOne(findTitle,function(err,person){

      		//console.log(person);

      		if (person==null) {
      			model.create(newTitle,function(){

		    		console.log("------------------create ok------------"+title0);
		    	});

      		}else{
      			console.log(newTitle.title+"已经存在---------------");

      			let update_where = {title:title0};//更新条件
				let update_data ={
									rank:rank0,
									time:time0,
									price:price0,
									review:review0,

									detail:{
								     	price:price0,
								     	rank:rank0,
								     	time:time0,
								     	review:review0
								     }

									};//更新
        let update_data2 ={
          									rank_new:rank0,
          									priceMax_new:priceMax_new,
                            priceMin_new:priceMin_new,
          									review_new:review_new,
                            star_new:star_new,
                            time_new:time0
          									};//更新

				model.update(update_where,{$push:update_data},function(err){
						    if(err){
						        console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
						    }else{
						        console.log('update success-----------'+title0);

						    }
				});
        model.update(update_where,{$set:update_data2},function(err){
                if(err){
                    console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                }else{
                    console.log('update success----new-------'+title0);

                }
        });

      		};

    	});

	}

}

function loadPath(dp,TEST_DIR,callback){
  var items = [] // files, directories, symlinks, etc
  var data1Str=[],data1=[];
  var item0,title=[];


  fs.walk(TEST_DIR)
    .on('readable', function () {
      var item
      while ((item = this.read())) {
        items.push(item.path);
      }
    })
    .on('end', function () {
      item0=items[0];
      items=items.slice(1);
      console.dir("load dir ----files-----------"+items) // => [ ... array of files]
      let ln=items.length;
      for (var i = items.length - 1; i >= 0; i--) {
              ln--;
              fs.readJson(items[i], function(err, data) {

              	for (let j = data.length - 1; j >= 0; j--) {
              		data1.push(data[j]);
              		title.push(data[j].title);

              	};

                if (ln<=0 && data1.length>=90) {

                		callback(dp,title,data1);

                	};



              });



      };



    })
  }

function unique(a){
 var res = [];
 var json = {};
 for(var i = 0; i < a.length; i++){
  if(!json[a[i]]){
  res.push(a[i]);
  json[a[i]] = 1;
  }else{
  json[a[i]]++
  }
 }
 return json;
};
}

 //loadPath('clothing','data/clothing/58/',updateRank);
function search() {

}

function lookProduct(DP,productTitle,type,result) {
    console.log(DP+'__'+productTitle);
    var dpModel= require(path.join(`${__dirname}`,'../js/model/'+DP+'.js')),
        lpModel= require(path.join(`${__dirname}`,'../js/model/look_product.js'));

    switch(type){

           case "addList":

              addList(DP,productTitle);

               break;

           case "updateProduct":

               updateProduct(DP,productTitle,type,result)

               break;

           case "dpcc":



               break;

  }




    function addList(DP,productTitle) {
      lpModel.findOne({title:productTitle}, function (err, doc) {
        // docs 此时只包含文档的部分键值

        if (!doc) {
          dpModel.findOne({title:productTitle}, function (err, doc2) {
            // docs 此时只包含文档的部分键值
            let newDoc={ title:doc2.title,
                        img:doc2.img,
                        link:doc2.link,
                        detail:doc2.detail,
                        priceMax_new:doc2.priceMax_new,
                        priceMin_new:doc2.priceMin_new,
                        rank_new:doc2.rank_new,
                        review_new:doc2.review_new,
                        star_new:doc2.star_new,
                        time_new:doc2.time_new,
                     price:doc2.price,
                     rank:doc2.rank,
                     time:doc2.time,
                     review:doc2.review};

            console.log(newDoc);
            lpModel.create(newDoc, function(error){
                if(error) {
                    console.log(error);
                } else {
                    console.log('save ok');
                }
            });
          });
        }else{
          alert("已经添加关注了")
        }
      });
    }

    function updateProduct(DP,productTitle,type,result) {
      console.log('updateProduct');

      let update_where = {title:productTitle};//更新条件

      let update_data ={
                keywords:result.keywords,
                ASIN:result.ASIN,
                firstDate:result.firstDate,
                rank_lp:result.rank
              },
          update_data2={
                ranks_lp:{rank:result.rank,
                          time:result.time}

          };//更新

//{$set: {y:9},$push:{o:90}}
      lpModel.update(update_where,{$set:update_data,$push:update_data2},function(err){
              if(err){
                  console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
              }else{
                  console.log('update success-----------'+productTitle);

              }
      });

    }


}


function test (argument) {
	// body...
	console.log('test')
}

module.exports = {
    update:update,
    lookProduct:lookProduct,
    load:load,
    test:test,
    search:search

};
