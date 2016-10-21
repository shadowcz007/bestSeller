   /*=====================================================================
    *keys-get a array contains all the keys in object*
    *@function*
    *@param url,id source*
    *@return {Array}*
    *@mark we have not check the source is or not object*
    =====================================================================*/

 

'use strict';
const fs = require('fs-extra');

var path=require('path');

require('events').EventEmitter.prototype._maxListeners = 200;

const {remote,ipcRenderer} = require('electron');
 
const later = require('later');

var obj=remote.getGlobal('sharedObj');

var department=require(path.join(`${__dirname}`,'../js/department.js'));



ipcRenderer.on('catch-result-save-reply', function (event, arg) {
  console.log('catch-result-save-reply------------'+arg) // 
  //department.save(arg);
})

function stock(){
      console.log(arguments);
      let link0=arguments[0];
  

  
 
      let url;

      $("#webview").append('<webview id="stock" src="'+link0+'" useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" autosize="on" maxwidth="960" maxheight="600" minwidth="576" minheight="432" nodeintegration> </webview>')
      
      var webview = document.getElementById("stock");
      //webview.loadURL('');

      console.log("startCatch");
            
            obj.max= $('#max').val();

           
            webviewJS_Main(webview);     


/*
      $('#scatch').click(function(){
            console.log("startCatch");
            
            obj.max= $('#max').value;

           
            webviewJS_Main();          
                            
                        
      });
 
 */ 







function webviewJS_Main(webview) {     
      
    
     
    webview.addEventListener('did-stop-loading', function () {

            webview.executeJavaScript(`

            const {ipcRenderer,remote} = require('electron');
            var stradd="https://www.amazon.com";
            var obj=remote.getGlobal('sharedObj');
            var html=document.getElementsByClassName('sc-list-body')[0].children;
            var ln=html.length;
                console.log("监控商品数量－－－－－－－－"+ln);
            var j=0;
            var TIME=60000,MAX;

            if (obj.max) {
                MAX=obj.max;
            }else{
                MAX=999/(ln-1);//监测ln个商品的时候
            };
            
              console.log("假定每个商品最大库存－－－－－－－－"+MAX);

            var intS=self.setInterval("clock()",TIME);

            var list=[];
                //console.log("监控频率／秒-------------"+TIME/1000);
            function clock(){

              console.log(j);
              
            if(j-1>=0 && html[j-1].getElementsByTagName("li")[1]){
                console.log(html[j-1].getElementsByTagName("li")[1].innerText)
              console.log(html[j-1].getElementsByTagName("li")[0].getElementsByTagName("a")[0].getAttribute("href"))
              var title= html[j-1].getElementsByTagName("li")[0].innerText;
                var stock;
              var testText= html[j-1].getElementsByTagName("li")[1].innerText;  
              var regexp = /Usually/gi;

              if(testText && testText!=="In Stock" && !regexp.test(testText) ){
                stock= html[j-1].getElementsByTagName("li")[1].innerText;
              }else{

                  var pppf= html[j-1].getElementsByClassName('sc-quantity-textfield')[0];
                
                if(pppf){
                     if(pppf.value){
                      stock=pppf.value;
                    }else{
                           var sel=html[j-1].getElementsByClassName('sc-invisible-when-no-js')[2].getElementsByTagName('select')[0];
                           stock=sel.options[sel.selectedIndex].text;   
                    }
                }   
                  

              }   
                
              var url= html[j-1].getElementsByTagName("li")[0].getElementsByTagName("a")[0].getAttribute("href");
                
                list.push({
                    "time":new Date(),
                    "title":title,
                    "stock":stock,
                    "url":stradd+url
                    
                })
                
            }

            if(j>=ln){

                intS=window.clearInterval(intS);
                console.log("监控完毕------------");
                console.log(list);
                 ipcRenderer.send('catch_stock-result-save',list);

               obj.Stockresult=list;
                
                return
            }

            var ppp= html[j].getElementsByClassName('sc-quantity-textfield');

            if(ppp[0]){
              ppp[0].className=ppp[0].className.replace('sc-hidden','');

              ppp[0].value=MAX;
              ppp[0].nextElementSibling.children[0].getElementsByTagName("a")[0].click();
            }else{
              console.log("erro");  
            }

            j++; 

            console.log("------------------------------------------------") 
             
            }
   
             
            
            console.log(JSON.stringify(list,null,2));
            
            `,false,function(){

              console.log("catch stock ok");

              //department.save();
              //ipcRenderer.send('catch_stock-result-save',obj.Stockresult);
              
              });
          webview.openDevTools();
    });  
   
   
    
      
   

  }

}

function spider(){
  console.log(arguments);
  let link0=arguments[0];
  

  var indicator = $(".indicator");
  indicator.show();
 
  let url;

  $("#webview").append('<webview id="amazon" src="'+obj.dpf+'" useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" autosize="on" maxwidth="960" maxheight="600" minwidth="576" minheight="432" nodeintegration> </webview>')
  var webview = document.getElementById("amazon");
  //webview.loadURL('');
  webviewJS(); 


  function creatWebView(link){
      console.log(link);
      
      let url0=link[0].replace(/\/ref=.*/g,'');

      var pageNum=[1,2,3,4,5],urls=[];  

      var webviews=[];

      for (let i = pageNum.length - 1; i >= 0; i--) {

          let url=url0+"/ref=zg_bs_apparel_pg_"+pageNum[i]+"?_encoding=UTF8&pg="+pageNum[i]+"&ajax=1&isAboveTheFold=";

          urls.push(url+0,url+1);
      };  

      console.log(urls);

      for (let i = urls.length - 1; i >= 0; i--) {
            $("#webview").append('<webview id='+(link[1]+i)+' src="'+urls[i]+'" useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" autosize="on" maxwidth="360" maxheight="900" minwidth="360" minheight="800" nodeintegration> </webview>')
            webviews.push(document.getElementById(link[1]+i));
      };

      let countsWeb=webviews.length;



      for (let i = webviews.length - 1; i >= 0; i--) {
            countsWeb--;
            bestSellersGet(webviews[i],countsWeb);
            //console.log(countsWeb+"00000000000000000000");
         

      };


}

function bestSellersGet(){
  let web=arguments[0];
  
  //remote.getGlobal('sharedObj').bestSellers['index']=arguments[1];   
      
      web.addEventListener('dom-ready', function () {
        
        console.log("dom-ready");
      
        
        web.executeJavaScript(`
          
          const {ipcRenderer,remote} = require('electron');
                
          
          var html=document.getElementsByClassName("zg_itemImmersion");
          
          var ln=html.length;
          //console.log(ln);
          var bs=[];
          var index=document.URL;


          if (html.length==0) {    
                    
              ipcRenderer.send('catch-result-save',[index,bs]);

          }else{

            for (var i = html.length - 1; i >= 0; i--) {
                ln--;
                var rank=html[i].getElementsByClassName("zg_rankDiv")[0].innerText.replace('.','');
                var img=html[i].getElementsByTagName("img")[0].getAttribute("src");
                //var title=html[i].getElementsByClassName("zg_title")[0].innerText;
                var link=html[i].getElementsByClassName("zg_title")[0].getElementsByTagName("a")[0].getAttribute("href");
                var review=html[i].getElementsByClassName("zg_reviews")[0].innerText.replace(/ out of 5 stars |,/g,'');
                var price=html[i].getElementsByClassName("zg_price")[0].innerText;
                bs.push({
                  "time":new Date(),
                  "rank":rank,
                  "img":img,
                  "title":link,
                  "link":link,
                  "review":review,
                  "price":price
                })
              //console.log(link);
              if (ln==0) {
                ipcRenderer.send('catch-result-save',[index,bs]);
              };
            }     

          };
         
                   
           //var index2=arguments[1]; 
           //console.log(index2+"index2index2index2index2index2");    
          //remote.getGlobal('sharedObj').bestSellers[index2]=bs;      
        
         

          //console.log(remote.getGlobal('sharedObj').bestSellers);

          console.log(JSON.stringify(bs,null,2));
          
          `,false,function(){

            console.log("catch ok");                   
                      
          
            });
                    
      web.openDevTools();
      
  });
}




function webviewJS() {     

    var webContents;
    var css="#zg_browseRoot{color:red;fontsize:44px}"

    var loadstart = function() {
      //indicator.show();

      console.log("loading");
      
    }
    
    var loadstop = function() {
      indicator.hide();
      //webview.print();
      //webview.insertCSS(css);
      
    }

    webview.addEventListener("did-start-loading", loadstart);
    webview.addEventListener("did-stop-loading", loadstop);
    webview.addEventListener('dom-ready', function () {
     
      if (obj.type==0) {
        webview.executeJavaScript(`

          const remote = require('electron').remote;
          var html;
          var result=[];

          if (document.getElementById("zg_browseRoot").childNodes[3].childNodes[3]) {

                html=document.getElementById("zg_browseRoot").childNodes[3].childNodes[3].getElementsByTagName("a");
                for (var i = html.length - 1; i >= 0; i--){

                var link=html[i].getAttribute("href");
                var title=html[i].innerText;
                result.push({
                    "time":new Date(),
                    "title":title,
                    "link":link
                  })
              };
          };     
 
          remote.getGlobal('sharedObj').result=result;  
          console.log(remote.getGlobal('sharedObj').result)
          console.log(JSON.stringify(result,null,2));
          
          `,false,function(){

            console.log("catch ok");

            department.save();

            $('#amazon').remove();
            creatWebView(link0);
            
            });
      };

      if (obj.type==1 ||2) {
        
        webview.executeJavaScript(`

          const remote = require('electron').remote;
          var result=[];
          var html;

          if (document.getElementsByClassName("zg_selected")[1] ) {

              html=document.getElementsByClassName("zg_selected")[1].parentNode.parentNode.childNodes[3];
              var nodeNameHTML=html.nodeName;

              if (nodeNameHTML=="UL") {
                var htmlLi=html.getElementsByTagName("a");

                for (var i = htmlLi.length - 1; i >= 0; i--){

                  var link=htmlLi[i].getAttribute("href");
                  var title=htmlLi[i].innerText;
                  result.push({
                      "time":new Date(),
                      "title":title,
                      "link":link
                    })
                };

                remote.getGlobal('sharedObj').result=result; 

              }else if(nodeNameHTML=="LI" ){

                  remote.getGlobal('sharedObj').result=[]; 

              };                

          }else {
                remote.getGlobal('sharedObj').result=[]; 
          };      
        
       
          

          console.log(remote.getGlobal('sharedObj').result)
          console.log(JSON.stringify(result,null,2));
          
          `,false,function(){

            console.log("catch ok");

            department.save();

            $('#amazon').remove();
            creatWebView(link0);
          
            });

      };    

     
      console.log("dom-ready");
      
      //webContents.downloadURL(url);
      webview.openDevTools();
      
  })
  }

}

module.exports = {
     
    target:obj.dpf,
    spider:spider,
    stock:stock
    

    
};
 





