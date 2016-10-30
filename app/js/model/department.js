var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheMa=new Schema({
    count:Number,
    title:String,
    link:String,

     select:Boolean,
     type:String,
     data:String,
     children:{
       count:Number,
       title:String,
       link:String,
        select:Boolean,
        type:String,
        data:String,
        children:Array,

     },

     updated: {type: Date,default:Date.now}

   },{collection:'department'});//记得指定collection



module.exports = mongoose.model('department', ScheMa);
