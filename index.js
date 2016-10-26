// 生成casper的实例  
// verbose默认值为false,即不输出来自phantom的信息(请记住,casper是基于phantom的)  
// logLevel表示何种级别输出信息,枚举为debug, info, warning, error 


//dianping下载shopid对应的user
//casperjs index.js --url=http://www.dianping.com/shop/ --category=58839368 --fetch=dpUser.js --pg=193
//如果是数组，
//调用xxxA.json
//

//dianping下载userface
//casperjs index.js --url=http://www.dianping.com/shop/ --category=KF --fetch=dpUser.js --download=true --pic=true

//dianping下载userMoreInfo
//casperjs index.js --url=http://www.dianping.com/shop/ --category=KF --fetch=dpUser.js --download=true




//landezine
//casperjs index.js --url=http://www.landezine.com/?cat=  --category=landezine --fetch=landezine.js



//amazon
// casperjs index.js   --fetch=amazon.js --site=Shoes  --category=bestseller



var fs=require('fs');
 

var casper = require('casper').create({  
    verbose: true,  
    logLevel: 'erro'  
});  
  
  
  
// casper.exit();  
  
 // 读取命令行的参数 
var opts = {  
    url : casper.cli.get("url"),  
    fetch : casper.cli.get("fetch"),  
    category : casper.cli.get("category"),
    ifDownLoad : casper.cli.get("download")  ,
    pic:casper.cli.get("pic"),
    pg:casper.cli.get("pg"),
    site:casper.cli.get("site")
};  

  console.log('---------------'); 
 console.log(opts.url);  
 console.log(opts.fetch); 
  console.log(opts.category); 
   console.log(opts.ifDownLoad); 
    console.log(opts.pic); 
     console.log(opts.pg); 
      console.log(opts.site); 
    
  console.log('---------------'); 
// 用来计算时间  
var startTime, endTime;  
  
  
// start中可以什么都不写  
casper.start();  
  
  
// 这句很重要,如果没有设置userAgent,则很多website会拒绝访问  
var userAgentString = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36';  
casper.userAgent(userAgentString);  
  

  
// 记录开始时间  
casper.then(function(){startTime = + new Date;});  
  
  
// 使用fetch文件夹中相对应的方法去捕获信息  

if (opts.category) {

    casper.then(function(){  

    if (opts.ifDownLoad) {

        var json;

        if (opts.pic) {

            json=fs.read('./data/'+opts.fetch.replace('.js','')+'/'+opts.category+'Personas.json');
             console.log("downLoad--true--------------------------pic--true");
             //console.log(json);
            opts.link=JSON.parse(json);


        }else{
            
            json=fs.read('./data/'+opts.fetch.replace('.js','')+'/'+opts.category+'1.json');
        
            opts.link=JSON.parse(json);

            console.log("downLoad--true--------------------------pic--false");
  

        };

            this.echo('LoadJson---------------------------------------');
            // this.echo(opts);
            require("./fetch/"+opts.fetch.replace(".js","Pic.js")).call(casper,opts);
        

    }else{
        
               
        require("./fetch/"+opts.fetch).call(casper,opts); 
        
    };

     
    }); 

};



/*
casper.then(function(){ 
    var json=fs.read('./data/'+opts.fetch.replace('.js','')+'/'+opts.category+'1.json');
    json=JSON.parse(json);
    
    opts.link=json;

    this.echo('LoadJson');
    
    require("./fetch/"+opts.fetch.replace(".js","Pic.js")).call(casper,opts);
}); 

*/


casper.on('saveToJson', function(data) {
    console.log(data);
 

    if (data.index==null) {
        var json2=JSON.stringify(data,['url']);
        //this.echo('okkkkk');
        var json3=json2.replace(/\{"url":\[/g,'').replace(/\]\}/g,'');
        /*
        var linksArray=json3.split(",");
        var ln=linksArray.length;

        if (ln>1000) {
          
          var lns=Math.ceil(ln/1000);


        };
    */
        fs.write('./data/'+opts.fetch.replace('.js','')+'/'+opts.category+'1.json',json3, 'w');
        this.echo('piclinks,saveToJson1--------------'+opts.category);
    };

    if(data.index==0){
        var json=JSON.stringify(data,undefined,2); 
        fs.write('./data/'+opts.fetch.replace('.js','')+'/'+opts.category+data.index+'.json',json, 'w');
        this.echo('urls,saveToJson0--------------'+opts.category);
    };

    if (data.index==2) {
        var json=JSON.stringify(data,undefined,2); 
        fs.write('./data/'+opts.fetch.replace('.js','')+'/'+opts.category+data.index+'.json',json, 'w');
        this.echo('pic64basecode,saveToJson2--------------'+opts.category);
    };
    
});  

//
casper.on('LoadJson', function() {

    var json=fs.read('./data/'+opts.fetch.replace('.js','')+'/'+opts.category+'0.json',json, 'w');

    this.echo('LoadJson');
    console.log(json);

    casper.emit('downLoadPic',json);
    
}); 

casper.on('downLoadPic',function(data){
     require("./fetch/"+opts.fetch.replace(".js","")+"Pic.js").call(casper,[opts,data]);
});
  
// 记录结束时间  
casper.then(function(){endTime = + new Date;});  
  
  
// 打印消耗的时间,单位分钟  
casper.then(function() {  
    var mins = Math.floor((endTime - startTime) / 60 / 100)/10;  
    this.echo(mins+" mins"); 
    
});  
 
 
  
casper.run();
