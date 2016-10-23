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

loadPath('data/clothing/1/') ;
//updateRank();

function updateRank(collecting,data){
    
    var _collecting="rank_clothing" || collecting;

    var ScheMa=new Schema({ 
     rank:String,
     bs_new:Array,
     bs_all:Array,
     bs_base:Array,
     bs_detail:Array,
     time:Array

    },{collection:_collecting});//记得指定collection


    var model=mongoose.model(_collecting,ScheMa);

    let bs_base_old=[];
    console.log(data.length)

    model.findOne({ rank:"1"}, function (err, it) {
      //console.log(it.bs_base);
      bs_base_old=it.bs_base;
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


function loadPath(TEST_DIR){
  var items = [] // files, directories, symlinks, etc
  var data1=[];
  var item0;
  

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
                 console.log(data); 
                data1.push(data);
                if (ln<=0) {
                  data1=JSON.stringify(data1).replace(/[|]/g,'');
                  let data2=JSON.parse(data1);
                  updateRank('',data2);
                };


              }); 



      };

      

    })
  }
