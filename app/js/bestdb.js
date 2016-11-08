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

// 降维，支持N维数组
Array.prototype.dr = function(){
    var that = this; // 不能给this赋值
    for (var i = 0; i < that.length; i++) {
        if(that[i] instanceof Array){
            that = that.slice(0, i).concat(that[i], that.slice(i+1));
            i--;
        }
    }

    return that;
};
const fs=require('fs-extra');
const path=require('path');
const {remote,ipcRenderer} = require('electron');


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
  //  ipcRenderer.send('result','[mongoose log] Error connecting to: ' + connectionString + '. ' + err);
  } else {

  //  ipcRenderer.send('result','[mongoose log] Successfully connected to: ' + connectionString);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function callback () {

  //ipcRenderer.send('result','mongoose open success');
});
var Schema=mongoose.Schema;


function loadRank(callback) {
    var model= require(path.join(`${__dirname}`,'../js/model/department.js'));

    model.find({select:true}, function (err, docs) {
        //  console.log(docs)
          return callback(docs);

        });
};

function loadRankOfProduct(dp,callback){
//  console.log(dp)
  var model= require(path.join(`${__dirname}`,'../js/model/rank.js'));
  model.find({department:{$regex:dp, $options:'i'}},function (err,product) {
    //console.log(product)
    return callback(product)

  })
}

function updateRank() {
    var data=arguments[0];
    var model= require(path.join(`${__dirname}`,'../js/model/rank.js'));
      let newData = {'title':data.title,
              'department':data.department,
              'rank':data.rank,
              'time':data.time,
              'link':data.link,
              'img':data.img,
              'review':data.review,
              'star':data.star,
              'priceMax':data.priceMax,
              'priceMin':data.priceMin,
              'data':data.data,
              'rank_new':data.rank,
              'priceMax_new':data.priceMax,
              'priceMin_new':data.priceMin,
              'review_new':data.review,
              'star_new':data.star,
              'time_new':data.time,
              'detail':{
                  'priceMax':data.priceMax,
                  'priceMin':data.priceMin,
                  'rank':data.rank,
                  'time':data.time,
                  'review':data.review,
                  'star':data.star
                 }
            };
      let findData={'data':data.data};
    model.findOne(findData,function(err,doc){
          if (doc==null) {
            model.create(newData,function(){

            ipcRenderer.send('result',"-----------------db-create ok------------"+findData.data);

          });

          }else{

            ipcRenderer.send('result',findData.data+"db已经存在---------------");
            let update_where = {data:data.data};//更新条件
            let update_data ={
                      rank:data.rank,
                      time:data.time,
                      priceMin:data.priceMin,
                      priceMax:data.priceMax,
                      review:data.review,
                      star:data.star,
                      detail:{
                          priceMin:data.priceMin,
                          priceMax:data.priceMax,
                          rank:data.rank,
                          time:data.time,
                          review:data.review,
                          star:data.star
                         }
                      };
            let update_data2 ={
                                rank_new:data.rank,
                                priceMax_new:data.priceMax,
                                priceMin_new:data.priceMin,
                                review_new:data.review,
                                star_new:data.star,
                                time_new:data.time
                                };
            model.update(update_where,{$push:update_data,$set:update_data2},function(err){
                    if(err){
                        ipcRenderer.send('result','update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!'+data.data);
                      //console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!'+data.data);

                    }else{
                        //console.log('update success-----------'+data.data);

                          ipcRenderer.send('result',data.data+'~~success');
                    }
            });
          };
      });
}




function load(DP,val,callback){
      var model= require(path.join(`${__dirname}`,'../js/model/'+DP+'.js'));

      if (DP=="look_product") {
          model.find({}, function (err, docs) {
                return callback(docs)
          });
      };

      if(DP=='rank'){
          model.find({star_new:{$gt:val}}, function (err, docs) {
          //  console.log(docs.length)
            return callback(docs)
          });
      };


}


function update(DP,counts,data) {

	//loadPath(DP,'data/'+DP+'/'+counts+'/',updateRank);

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
    //  console.dir("load dir ----files-----------"+items) // => [ ... array of files]
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

function search() {

}

function lookProduct(productData,type,result) {
    //console.log('__'+productData);
    var dpModel= require(path.join(`${__dirname}`,'../js/model/rank.js')),
        lpModel= require(path.join(`${__dirname}`,'../js/model/look_product.js'));

    switch(type){

           case "addList":

              addList(productData,result);

               break;

           case "updateProduct":

               updateProduct(productData,type,result)

               break;

           case "loadProduct":

              loadProduct(productData,type,result);

               break;

  }




    function addList(productData,result) {
      console.log(productData)
      lpModel.findOne({link:productData}, function (err, doc) {
        // docs 此时只包含文档的部分键值

        if (!doc) {
          dpModel.findOne({data:productData}, function (err, doc2) {
            // docs 此时只包含文档的部分键值
            if (doc2) {
                let newDoc={ title:doc2.title,
                            data:doc2.data,
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
              }else{
                let newDoc={link:result.link};
                //console.log(newDoc)
                lpModel.create(newDoc, function(error){
                    if(error) {
                        console.log(error);
                    } else {
                        console.log('save ok');

                    }
                });
              };
          });
        }else{
          alert("已经添加关注了")
        }
      });
    }

    function updateProduct(productData,type,result) {
      console.log('updateProduct');
      console.log(productData[0]);
      let update_data ={
                link:result.url,
                title:result.title,
                keywords:result.keywords,
                ASIN:result.ASIN,
                firstDate:result.firstDate,
                rank_lp:result.rank,
                img:result.img,
                time_lp:result.time,
                review_lp:result.review|| 0,
                star_lp:result.star|| 0,
                priceMin_lp:result.priceMin|| 0,
                priceMax_lp:result.priceMax|| 0,
                size_lp:result.size,
                color_lp:result.color
              },
          update_data2={
                ranks_lp:{rank:result.rank|| 0,
                          time:result.time},
                reviews_lp:{review:result.review|| 0,
                          time:result.time},
                stars_lp:{star:result.star|| 0,
                          time:result.time},
                priceMins_lp:{priceMin:result.priceMin|| 0,
                              time:result.time},
                priceMaxs_lp:{priceMax:result.priceMax|| 0,
                              time:result.time}
          };

      lpModel.findOne(productData[0], function (err, doc) {
          if(doc){
                let update_where = productData[0];//更新条件
                lpModel.update(update_where,{$set:update_data,$push:update_data2},function(err){
                        if(err){
                            console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            ipcRenderer.send('result',result.keywords+'~~error');
                        }else{
                            console.log('update success-----------'+result.keywords);
                            ipcRenderer.send('result',result.keywords+'~~success');
                        }
                });
          }else{
                let update_where = productData[1];//更新条件
                lpModel.update(update_where,{$set:update_data,$push:update_data2},function(err){
                        if(err){
                            console.log(err)
                            console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            ipcRenderer.send('result',result.keywords+'~~error');
                        }else{
                            console.log('update success-----------'+result.keywords);
                            ipcRenderer.send('result',result.keywords+'~~success');
                        }
                });


          }
      });



    };

    function loadProduct(productData,type,result) {

          switch (productData) {
            case 'all':
                lpModel.find({}, function (err, docs) {
                //  console.log(docs)
                  result(docs);
                });

              break;
            default:

          }



    }





}


function test (argument) {
	// body...
	console.log('test')
}

function topReviewers(result,callback) {
    console.log(arguments);
    var model= require(path.join(`${__dirname}`,'../js/model/topReviewers.js'));

    if (result) {

          let findName={userID:result.userID};


          model.findOne(findName,function(err,person){
              console.log(person);
              if (person === null) {
                  console.log(person);
                model.create(result,function(){
                //  console.log("------------------create ok------------"+result);
                    ipcRenderer.send('result',"------------------create ok------------"+result);
                });

              }else{

                let update_data1,update_data2;

                if (result.avatar) {

                  update_data1={
                                avatar:result.avatar,
                                location:result.location ||0,
                                bioExpander:result.bioExpander ||0,
                                wListCount:result.wListCount ||0,
                                reviewsContent:result.reviewsContent ||0
                              };

                  // update_data2={

                          //    };
                            //  ,$addToSet:update_data2
                   model.update(findName,{$set:update_data1},function(err){
                                                  if(err){
                                                      console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                                  }else{

                                                      //console.log('update topReviewers detail------------')
                                                        ipcRenderer.send('result','update topReviewers detail------------'+result);
                                                    //  console.log('update success-----------'+result);
                                                  }
                  });

                }else{

                  update_data1={
                                hfVotes:result.hfVotes,
                                wishList:result.wishList||0,
                                totalReviews:result.totalReviews,
                                percentHelpful:result.percentHelpful,
                                rank:result.rank
                              };

                   update_data2={
                                rankChange:result.rank
                              };

                  model.update(findName,{$set:update_data1,$push:update_data2},function(err){
                                      if(err){
                                        console.log(err)
                                          console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                      }else{
                                        //  console.log('update topReviewers all------------')
                                            ipcRenderer.send('result','update topReviewers all------------'+result);
                                          //console.log('update success-----------'+result);
                                      }
                  });

                }








              };
          })




    }else{
      model.find({},function(err,docs){
            return callback(docs);
      })

    }





}



function loadDepartment(result){
  var model= require(path.join(`${__dirname}`,'../js/model/department.js'));
  model.find({},function(err,docs){
    //console.log(docs);
    return result(docs)
  })
};

function updateDepartment(doc){
  var model= require(path.join(`${__dirname}`,'../js/model/department.js'));



  model.findOne({data:doc.data},function(err,result){
      console.log(result)
      if (result !== null) {
        var update_data1={links:doc.links,children:doc.children};

         var update_data2={
                      links:doc.links,
                      children:doc.children
                    };

        model.update({data:doc.data},{$set:{links:doc.links,children:doc.children}},function(err){
                            if(err){
                              console.log(err)
                                console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            }else{
                                console.log('update topReviewers all------------')

                                console.log('update success-----------');
                            }
        });
      }else{
        var update_data1={
                        "children.$.type":'dpc',
                        "children.$.links":doc.links,
                        "children.$.children":doc.children
                    };
        model.update({"children.data":doc.data},{$set:update_data1},function(err){
                            if(err){
                              console.log(err)
                                console.log('update error!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            }else{


                                console.log('update success-----------');
                            }
        });
      }
  })
};




module.exports = {

    update:update,
    lookProduct:lookProduct,
    topReviewers:topReviewers,
    loadDepartment:loadDepartment,
    updateDepartment:  updateDepartment,
    load:load,
    loadRank:loadRank,
    loadRankOfProduct:loadRankOfProduct,
    updateRank:updateRank,
    test:test,
    search:search

};
