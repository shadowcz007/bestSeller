//load json,add element

const fs = require('fs-extra');
const path=require('path');
const {remote,ipcRenderer} = require('electron');
const bestdb=require(path.join(__dirname, './bestdb.js'));



var obj=remote.getGlobal('sharedObj');
var regid=new RegExp(/&|\s|'|,/g);

function update(fileName,dpName,dataID,fSrc,type,count){
	console.log("type"+type)
	json=fs.readJsonSync(path.join(`${__dirname}`,'../js/data/'+fileName+'.json'));

	let ln=json.length;
	console.log(json);
	let create=true;

	for (var i = json.length - 1; i >= 0; i--) {
		ln--;

		if (json[i].title==dpName) {
			create=false;
		}
		if (ln<=0) {
			next(fileName,dpName,dataID,fSrc,type,count,create);
		};
	};


	function next(fileName,dpName,dataID,fSrc,type,count,create){
		let outCount;
		if (create==true) {
			let p=new Object();
			p["data"]=dataID;

			if (count==null) {
				p["count"]=0;

			};

			p["count"]=parseInt(count)+1;

			outCount=p["count"];

			p["select"]=true;
			p["title"]=dpName;
			if (type) {
				p["type"]=type;
			};

			p["link"]=fSrc;
			json.push(p);


		}else{

			for (var i = json.length - 1; i >= 0; i--) {

			if (json[i].title==dpName) {
				json[i].select=true;
				json[i]["data"]=dataID;
				if (count==null) {
					json[i]["count"]=0;
				};
				json[i]["count"]=parseInt(count)+1;
				outCount=json[i]["count"];
				if (type) {
				json[i]['type']=type;}
			}

		};}

		fs.outputJsonSync(path.join(`${__dirname}`,'../js/data/'+fileName+'.json'),json);
		console.log("update ok;count-----"+outCount+",,title--"+dpName);
	}

}
function load(){

	console.log("load------params---"+arguments[0]);

	var json;

	let dp=$("#"+arguments[0]);
	let ln=dp.children().length;

	//console.log(dp);
	//console.log(ln);
	if (arguments[0]=="start") {

		json=fs.readJsonSync(`${__dirname}/data/AnyDepartment.json`);
		$('.addlist').html('');

		for (var i = json.length - 1; i >= 0; i--) {
			 console.log("start");
			if(json[i].select==true){

				let linkd=json[i].link;
				//let count=json[i].
	 			let dataStr=linkd.replace(/.*\/Best-Sellers-|\/zgbs.*/ig,'');

				$('.addlist').append("<li id="+json[i].title.replace(regid,'').toLowerCase()+" class='list-group-item' src='"+linkd+"' data='"+dataStr.toLowerCase()+"' count='"+json[i].count+"'><div class='media-body'><strong>"+json[i].title+"</strong></div></li>");

	 			};
			};

				//////////// load from db
			bestdb.load("look_product",'',function (docs) {
					console.log(docs);
					$('.look_product_list').html('');
					for (var i = 0; i < docs.length; i++) {

						$('.look_product_list').append(`
							<li class='list-group-item' src=`+docs[i].link+` data=`+docs[i].title+`>
							<div class='media-body'>
							<strong>`+docs[i].title+`</strong>
							</div>
							</li>`);
					}


			});








	};



	if (ln==0 && arguments[0]=="dpf") {

 		console.log("load------------------ AnyDepartment.json")

 		json=fs.readJsonSync(`${__dirname}/data/AnyDepartment.json`);

 		let count=json.length;

 		for (var i = 0; i <= json.length - 1; i++) {
 			if (json[i].type=="dpf"||!json[i].type) {
 			//dpf.append("<tr class='dpf'><td src='"+json[i].link+"'>"+json[i].title+"</td><td ></td></tr>");
 			let linkd=json[i].link;
 			let dataStr=linkd.replace(/.*\/Best-Sellers-|\/zgbs.*/ig,'');

			dp.append("<li id="+json[i].title.replace(regid,'').toLowerCase()+" class='list-group-item hoverAni dpf' src='"+linkd+"' data='"+dataStr.toLowerCase()+"' count='"+json[i].count+"'><div class='media-body'><strong>"+json[i].title+"</strong></div></li>");

 			};
 			//console.log(count);
 		};

 	};

 	if (arguments[0]=="dpc") {

 		json=fs.readJsonSync(arguments[1]);

 		console.log("load------------------ "+arguments[1]);

 		//console.log(json);

 		let count=json.length;

 		if (count==0) {

            console.log("=============没有下一级")

        }else{

            var html3=$('#'+arguments[2].replace(/&|\s/g,''));


            let delStr=arguments[2].replace(/\s&\s/g,' ');

			//console.log("delStr-------------------"+delStr)

            for (let i = 0; i <= json.length - 1; i++) {
            	let linkd=json[i].link;
 				let dataStr=linkd.replace(/.*\/Best-Sellers-|\/zgbs.*/ig,'');

	 			html3.after("<li id="+json[i].title.replace(regid,'').toLowerCase()+" class='dpc hoverAni' src='"+linkd+"' data='"+dataStr.toLowerCase()+"'><div class='media-body'><strong>"+json[i].title.replace(/-/g,' ').replace(delStr,'')+"</strong></div></li>");

	 		};
        };
 	};

 	if (arguments[0]=="dpcc" || arguments[0]=="dpccc") {

 		json=fs.readJsonSync(arguments[1]);

 		//console.log("read-------!!! "+arguments[1]);

 		//console.log(json);

 		let count=json.length;

 		if (count==0) {

            console.log("=============没有下一级")

        }else{

            var html3=$('#'+arguments[2].replace(/&|\s/g,''));


            let delStr=arguments[2].replace(/\s&\s/g,' ');

			//console.log("delStr-------------------"+delStr)

            for (let i = 0; i <= json.length - 1; i++) {
            	let linkd=json[i].link;
 				let dataStr=linkd.replace(/.*\/Best-Sellers-|\/zgbs.*/ig,'');

	 			html3.after("<li id="+json[i].title.replace(regid,'').toLowerCase()+" class='dpcc hoverAni' src='"+linkd+"' data='"+dataStr.toLowerCase()+"'><div class='media-body'><strong>"+json[i].title.replace(/-/g,' ').replace(delStr,'')+"</strong></div></li>");

	 		};
        };
 	};


}


function loadPath(TEST_DIR){
	var items = [] // files, directories, symlinks, etc
	var data1=[];
	var item0;
	var html=$('#bestsellers');
	html.html('');

	fs.walk(TEST_DIR)
	  .on('readable', function () {
	    var item
	    while ((item = this.read())) {
	      items.push(item.path);
	    }
	  })
	  .on('end', function () {
	  	item0=items[0];
	  	items=items.slice(1);
	    console.dir("load dir ----files-----------"+items) // => [ ... array of files]

	    var ln=items.length;
	    var fmax=[];
	    for (var i = items.length - 1; i >= 0; i--) {
	    	ln--;
	    	fmax.push(items[i].replace(/\/[0-9]{0,8}.json/g,'').replace(/.*\//g,''));


 			if (ln<=0) {
 				let max=Math.max.apply(null, fmax);
 				console.log("-max-count----"+max);


 				 readJsonOP(item0+'/'+max+'/');
 			};
	    };

	  })

function readJsonOP(path){
	let items=[];
	let data2=[];
	fs.walk(path)
	  .on('readable', function () {
	    let item
	    while ((item = this.read())) {
	      items.push(item.path);
	    }
	  })
	  .on('end', function () {

	  	items=items.slice(1);
	    console.dir("load dir ----files-----------"+items) // => [ ... array of files]

	    let ln=items.length;

	    for (let i = items.length - 1; i >= 0; i--) {
	    	 	fs.readJson(items[i], function(err, data) {
	    	 	if (data==0) {
	    	 		console.log("暂时没内容")
	    	 		return
	    	 	};
			    ln--;
			    data2.push(data);

 				if(ln<=0){

 					var jsonStr='['+JSON.stringify(data2).replace(/\[|\]/g,'')+']';
 					//console.log(jsonStr)
 					var json1=JSON.parse(jsonStr);
 					//console.log(json1);
 					for (let i = json1.length - 1; i >= 0; i--) {

 						var img,link,price,rank,review,title,id;

					    img=json1[i].img;
					    link=json1[i].link;
					    price=json1[i].price;
					    rank=json1[i].rank;
					    review=json1[i].review.replace(/.*\(|\).*/g,'');
					    title=json1[i].title;
					    pf=json1[i].review.replace(/\(.*/g,'');

					    id=title.toLowerCase();

					   	html.append("<li id="+id.replace(/-/g,'')+" class='list-group-item hoverAni bs' src='"+link+"' data='"+title+"'><img class='img-rounded media-object pull-left' src='"+img+"' width='44' height='44'><div class='media-body'><p class='rankLast'>"+rank+"/</p><p class='rankNow'>"+rank+"</p><strong>"+title+"</strong><p class='price'>价格:"+price+"</p><p class='pf' style='width:"+parseFloat(pf)*20+"%;'>评分:"+pf+"</p><p class='review'>评论:"+review+"</p></div></li>");

 					};


 				}
			  });





 			};
	    });



}





}



function save(){

	console.log("department------save");
	//console.log(arguments);
  	var result=obj.result;

  	var fileName;

  	let key=Object.keys(obj.selected);

  //	var bs=obj.bestSellers;

  	if (result) {

	        for (var i = result.length - 1; i >= 0; i--) {
	         result[i].title= result[i].title.replace(/.*.Best-Sellers-|\/zgbs.*/g,"");
	         result[i].link=result[i].link;
	         //console.log("1111111111"+result[i].title);
	        };

	        $("#result").append('<p>' + JSON.stringify(result,null,2).replace(/{|}|[|]/g,' ') + '</p>');

	         console.log(path.join(`${__dirname}`,'../js/data/'+obj.dpf[1]+'.json'));
	        fs.outputJsonSync(path.join(`${__dirname}`,'../js/data/'+obj.dpf[1]+'.json'),result);

	       // console.log(ipcRenderer);

	        //ipcRenderer.send('catch-result-save',path.join(`${__dirname}`,'../js/data/'+obj.dpf[1]+'.json'));
	 }

	  if (result.length==0){
	    console.log('result none');
	     fs.outputJsonSync(path.join(`${__dirname}`,'../js/data/'+obj.dpf[1]+'.json'),result);

	  };

 		if (arguments.length==2) {

 			console.log(arguments);

		  	console.log("arguments-----ok");

			fs.outputJsonSync(path.join(`${__dirname}`,'../js/data/'+arguments[0].toLowerCase()+'.json'),arguments[1]);

 		};




  //department.show(path.join(`${__dirname}`,'../js/data/'+obj.dpf[1]+'.json'));

}

module.exports = {
    load: load,
    loadPath:loadPath,
    save: save,
    update:update

};
