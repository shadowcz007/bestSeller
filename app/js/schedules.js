

'use strict';

const path=require('path');
const {remote,ipcRenderer} = require('electron');
const later = require('later');
const nodemailer = require('nodemailer');


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

function email() {
	console.log("email send start");
	let subject=arguments[0],
			html=arguments[1];

	var transporter = nodemailer.createTransport({
															host: 'smtp.163.com',

 															port: 25, // port
															auth: {
																	user: 'chizhiwei007@163.com',
																	pass: 'j98ijkji305x'
															}
															});
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"test 👥" <chizhiwei007@163.com>', // sender address
	    to: '389570357@qq.com', // list of receivers
	    subject: subject, // Subject line
	    //text: 'Hello world 🐴', // plaintext body
	    html: html // html body
	};


	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
					ipcRenderer.send('result',error);
	        return console.log(error);

	    }
			ipcRenderer.send('result','Message sent: ' + info.response);
	  	//console.log('Message sent: ' + info.response);
	});
}

function rankStart(){
  let urls=arguments;
  ipcRenderer.send('catch_rankStart',urls);
}

function lookProduct(urls){
    later.date.localTime();
    console.log("Now:"+new Date());

    var sched = later.parse.recur().every(60).minute(),
                t = later.setInterval(function() {

										ipcRenderer.send('result','lookProduct运行一次');

                    console.log("catch_lookProduct运行一次--------------"+new Date());
										email(new Date(),"look product");
                    ipcRenderer.send('catch_lookProduct',urls);
                }, sched);

    setTimeout(function(){
               t.clear();
               console.log("catch_sched_lookProduct_Clear");
            },604800*2000);

    setTimeout(function() {
				ipcRenderer.send('result',"catch_lookProduct立刻运行一次--------------");
      console.log("catch_lookProduct立刻运行一次--------------");
			email(new Date(),"look product");
      ipcRenderer.send('catch_lookProduct',urls);
    }, 1000)
}

function topReviewers(sf,st,type){
		console.log(sf)
		
    ipcRenderer.send('catch_topReviewers',['https://www.amazon.com/review/top-reviewers/ref=cm_cr_tr_link_',sf,st,type]);
}

function tranformArray(array) {
	console.log(JSON.stringify(array))
  var c = JSON.stringify(array).replace(/\[|\]/g,'').split(",");
	console.log(c.length)
  return c;

}
module.exports = {

    start:start,
		rankStart:rankStart,
		lookProduct:lookProduct,
		topReviewers:topReviewers,
		email:email




};
