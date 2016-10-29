'use strict';

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
	console.log("email send");
	let subject=arguments[0],
			html=arguments[1];
	var transporter = nodemailer.createTransport('smtps://389570357%40qq.com:j98ijkji305x@smtp.qq.com');

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"test 👥" <389570357@qq.com>', // sender address
	    to: '389570357@qq.com', // list of receivers
	    subject: subject, // Subject line
	    //text: 'Hello world 🐴', // plaintext body
	    html: html // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}


module.exports = {

    start:start,
		email:email




};
