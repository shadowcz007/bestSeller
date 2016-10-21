'use strict';

const later = require('later');

function start () {
	

later.date.localTime();

console.log("Now:"+new Date());

var sched = later.parse.recur().every(10).second(),
    t = later.setInterval(function() {
        test();
    }, sched);

function test() {
   console.log("运行一次--------------"+new Date());
 	
}

setTimeout(function(){
   t.clear();
   console.log("Clear");
},30*1000);



}




module.exports = {
     
    start:start
   
    

    
};