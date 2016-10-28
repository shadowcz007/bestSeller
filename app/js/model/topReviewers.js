var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheMa=new Schema({
     name:String,
     userID:String,
     location:String,
     bioExpander:String,
     hfVotes:Number,
     rank:Array,
     avatar:String,
     wishList:Array,
	   totalReviews:Number,
     percentHelpful:Number,
     link:String,
     updated: {type: Date,default:Date.now}

   },{collection:'topReviewers'});//记得指定collection



module.exports = mongoose.model('topReviewers', ScheMa);
