var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheMa=new Schema({
     title:String,
     img:String,
     link:String,
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

    },{collection:'rank_clothing'});//记得指定collection



module.exports = mongoose.model('rank_clothing', ScheMa);
