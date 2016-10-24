const fs=require('fs-extra');//读写文件
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
  // yay!
	console.log('mongoose open success');
});


var Schema=mongoose.Schema;

//loadPath('data/clothing/4/') ;
//updateRank();

function updateRank(){
  //console.log(arguments[0])
  	var bs_base=arguments[1];
   	var data=arguments[2];
    var _collecting="rank_"+arguments[0];

    var ScheMa=new Schema({ 
     rank:Number,
     bs_new:Array,
     bs_all:Array,
     bs_base:Array,
     bs_detail:{
     		title:{ type: String},
     		img:{type:String},
     		link:{ type: String},
	     	price: { type: String},
		    rank:{ type: Number} ,
		    review:{ type:String},
		    time:{ type: Date}
			},      
     updated: {type: Date,default:Date.now}

    },{collection:_collecting});//记得指定collection


    var model=mongoose.model(_collecting,ScheMa);

    let bs_base_old=[],
    	bs_new=[],
    	bs_all=[];

    console.log(data[99].rank)
  

    model.findOne({}, function (err, it) {
       console.log(it)
       if (!it) {

       		for (var i = data.length-1; i >= 0; i--) {     			
   	       		var doc = new model({ 
					       			 rank:parseInt(data[i].rank),
					       			 bs_new:bs_base,
					       			 bs_all:bs_base.concat(bs_base_old),
								     bs_base:bs_base,
								     bs_detail:{
								     		title:data[i].title,
								     		img:data[i].img,
								     		link:data[i].link,
									     	price:data[i].price,
										    rank:parseInt(data[i].rank),
										    review:data[i].review,
										    time:data[i].time
											} ,
									updated: data[i].time  
					       		});

				// 调用 .save 方法后，mongoose 会去你的 mongodb 中的 test 数据库里，存入一条记录。
				doc.save(function (err) {

				  if (err) {
				  	console.log(err)
				  }

				  console.log('init-----save to db'+i);

				});

			};
       }else{

       		for (var i = data.length - 1; i >= 0; i--) {
       			
       		

					let update_where = {"rank":parseInt(data[i].rank)};//更新条件
					
					let update_data1 ={	

					       			 bs_new:bs_base,
					       			 bs_all:bs_base.concat(bs_base_old),
								     bs_base:bs_base,								     
									 updated: data[i].time  
										 
								};//更新数据

					
						 		
					model.update(update_where,{$set:update_data1},function(err){
							
							if(err){

								        console.log('update error!!!!!!!!!!'+err);
							}else{
								      
								        console.log('update success-----------');						         

								    }
					});	      		





			};

			for (var i = data.length - 1; i >= 0; i--) {
       			
       		

					let update_where = {"rank":parseInt(data[i].rank)};//更新条件
					
					
					let update_data2 ={						       			 
								     bs_detail:{
								     		title:data[i].title,
								     		img:data[i].img,
								     		link:data[i].link,
									     	price:data[i].price,
										    rank:parseInt(data[i].rank),
										    review:data[i].review,
										    time:data[i].time
											} 										 
								};//更新
						 		
					model.update(update_where,{$push:update_data2},function(err){
							
							if(err){

								        console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
							}else{
								      
								        console.log('update success-----------');						         

								    }
					});	      		





			};




       };

      //console.log(it.bs_base);
     
      //let new_bs=bs_base_old.concat(bs_base);
      //let bs_tg=unique(new_bs);
      //console.log("-------"+bs_tg)
      

    });


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

/*
  let time="2016-10-21T04:00";
  let rank=it.rank,

  shop=[{time:time,title:it.title,link:it.link,img:it.img,price:it.price,review:it.review}];

  db.rank_clothing.save({rank:rank,bs_new:[],bs_all:[],bs_base:bs_base,bs_detail:shop,time:[time]});


*/

/*
    let update_where = {"rank":id};//更新条件
    let update_data = {"lat":lat,"lng":lng,"address":address,"shopname":name};//更新数据
    
    model.update(update_where,{$set:update_data},function(err){
        if(err){
            console.log('update error!!!!!!!!!!!!!!!!!!!!!'+i);
        }else{
            console.log('update success-----------'+i);

        }
    });
*/

}





 // initDP("app");

function initDP(){

	var _collecting="rank_clothing"  ;

    var ScheMa=new Schema({ 
     rank:String,
     bs_new:Array,
     bs_all:Array,
     bs_base:Array,
     bs_detail:Array,
     time:Array

    },{collection:_collecting});//记得指定collection


    var model=mongoose.model(_collecting,ScheMa);

/*

    model.findOne({}, function (err, it) {
      if (!it) {
      	   	var doc = new model({ rank: rank, bs_new:[],bs_all:[],bs_base:bs_base,bs_detail:shop,time:[time]});

			// 调用 .save 方法后，mongoose 会去你的 mongodb 中的 test 数据库里，存入一条记录。
			doc.save(function (err) {
			  if (err) // ...
			  console.log('init-----save to db');
			});

      	
      };
      console.log(it);
  
      //let new_bs=bs_base_old.concat(bs_base);
      //let bs_tg=unique(new_bs);
      //console.log("-------"+bs_tg)
      

    });
 */  

}
 
loadPath('clothing','data/clothing/6/',updateRank);
 

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
              	
 				//let array1=dataStr.split();
 				//data1Str.push(dataStr);
 
                if (ln<=0 && data1.length==100) {
                	//console.log(data1.length);
                		
                		callback(dp,title,data1);

                	};
                


              }); 



      };

      

    })
  }
