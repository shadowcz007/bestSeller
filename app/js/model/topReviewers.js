var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheMa=new Schema({
     name:String,
     userID:String,
     location:String,
     bioExpander:String,
     hfVotes:Number,
     rank:Number,
     rankChange:[Number],
     avatar:String,
     reviewsContent:Array,
     wListCount:Number,
     wishList:Array,
	   totalReviews:Number,
     percentHelpful:Number,
     link:String,
     updated: {type: Date,default:Date.now}

   },{collection:'topReviewers'});//记得指定collection



module.exports = mongoose.model('topReviewers', ScheMa);
