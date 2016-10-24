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
	 price:Array,
	 rank:[Number],
	 time:[Date],
	 review:Array,		      
     updated: {type: Date,default:Date.now}

    },{collection:'rank_clothing'});//记得指定collection


  
module.exports = mongoose.model('rank_clothing', ScheMa);          