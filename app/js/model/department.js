var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheMa=new Schema({
    count:Number,
    title:String,
    link:String,
    links:Array,
     select:Boolean,
     type:String,
     data:String,
     time:Date,
     children:Array,

     updated: {type: Date,default:Date.now}

   },{collection:'department1'});//记得指定collection



module.exports = mongoose.model('department1', ScheMa);
