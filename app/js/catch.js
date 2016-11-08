
'use strict';
const fs = require('fs-extra');
const path=require('path');
const {remote,ipcRenderer} = require('electron');
const later = require('later');

var obj=remote.getGlobal('sharedObj');

 

function stock(){
      console.log(arguments);
      let link0=arguments[0];
      let url;

      $("#webview").append('<webview id="stock" src="'+link0+'" useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" autosize="on" maxwidth="960" maxheight="600" minwidth="576" minheight="432" nodeintegration> </webview>')

      var webview = document.getElementById("stock");
      console.log("startCatch");
            obj.max= $('#max').val();
            webviewJS_Main(webview);

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

              });
          webview.openDevTools();
    });

  }

}


module.exports = {

    target:obj.dpf,
    stock:stock



};
