var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheMa=new Schema({
      department:String,
      data:String,
      title:String,
      img:String,
      link:String,
      detail:[{
          priceMin:Number,
          priceMax:Number,
         	rank:Number,
         	time:Date,
         	review:String,
          star:String
       }],
     priceMax_new:Number,
     priceMin_new:Number,
     rank_new:Number,
     review_new:Number,
     star_new:Number,
     time_new:Date,
     priceMin:[Number],
     priceMax:[Number],
  	 rank:[Number],
  	 time:[Date],
     star:[Number],
  	 review:[Number],
     updated: {type: Date,default:Date.now}

    },{collection:'rank'});//记得指定collection



module.exports = mongoose.model('rank', ScheMa);
