var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheMa=new Schema({
  department:String,
  data:String,
     title:String,
     img:String,
     link:String,
     keywords:String,
     ASIN:String,
     firstDate:Date,
     rank_lp:String,
     ranks_lp:Array,
     review_lp:Number,
     reviews_lp:Array,
     priceMin_lp:Number,
     priceMins_lp:Array,
     priceMax_lp:Number,
     priceMaxs_lp:Array,
     star_lp:Number,
     stars_lp:Array,
     color_lp:Array,
     size_lp:Array,
     isLooking:Boolean,
     time_lp:Date,
     detail:[{
     	price:String,
     	rank:Number,
     	time:Date,
     	review:String
     }],
     priceMax_new:Number,
     priceMin_new:Number,
     rank_new:Number,
     review_new:Number,
     star_new:Number,
     time_new:Date,
	 price:Array,
	 rank:[Number],
	 time:[Date],
	 review:Array,
     updated: {type: Date,default:Date.now}

   },{collection:'look_product'});//记得指定collection



module.exports = mongoose.model('look_product', ScheMa);
