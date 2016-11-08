const path=require('path');
const {remote,ipcRenderer} = require('electron');
const bestdb=require(path.join(`${__dirname}`,'../js/bestdb.js'));

var obj=remote.getGlobal('sharedObj');
let webviews=$('#webviews');

function spider() {
    let lpUrls=obj.dpf[0];
         console.log(obj.dpf);
    var stepByStep=function () {

        webviews.html(`
                  <h3 class=lpTitle>`+lpUrls+`</h3>
                  <webview class='lpWebview' id='lp' src=`+lpUrls+` useragent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36' nodeintegration>
                  </webview>
              `);

          let webview=document.getElementById('lp');
          //console.log(webview);
          webview.addEventListener('dom-ready', function () {
          //  webview.openDevTools();
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

              console.log(JSON.stringify(result,null,2));

              `,false,function(){
                  console.log("catch------product ok");
                });
          };

          if (obj.type==1 || 2) {
            console.log(webview)

            webview.executeJavaScript(`
              const path=require('path');
              console.log(path.join('`+`${__dirname}`+`','../js/bestdb.js'));
              const bestdb=require(path.join('`+`${__dirname}`+`','../js/bestdb.js'));

              var result=[],links=[],parent;
              var html;

              if (document.getElementsByClassName("zg_selected")[1] ) {

                  html=document.getElementsByClassName("zg_selected")[1].parentNode.parentNode.childNodes[3];
                  parent=document.URL.replace(/.*\\/Best-Sellers-|\\/zgbs.*/ig,'').toLowerCase();
                  var nodeNameHTML=html.nodeName;

                  if (nodeNameHTML=="UL") {
                    var htmlLi=html.getElementsByTagName("a");
                    for (var i = htmlLi.length - 1; i >= 0; i--){
                      var link=htmlLi[i].getAttribute("href");
                      var title=htmlLi[i].innerText;
                      links.push(link);

                      result.push({
                              "data":link.replace(/.*\\/Best-Sellers-|\\/zgbs.*/ig,'').toLowerCase(),
                              "title":title,

                              "parent":parent,
                              "link":link,
                              "select":false
                        })
                    };
                    var pData={
                      "title":document.getElementsByClassName("zg_selected")[1].innerText,

                      "link":document.URL,
                      "links":links,
                      "data":parent,
                      "children":result
                    }
                    console.log(pData)
                    bestdb.updateDepartment(pData);

                  }else if(nodeNameHTML=="LI" ){
                    var pData={
                        "links":document.URL,
                        "title":parent,
                        "children":null
                      };
                      // bestdb.updateDepartment(pData);

                  };

              }else {
                var pData={
                    "links":document.URL,
                    "title":parent,
                    "children":null
                  };
                  // bestdb.updateDepartment(pData);
              };


              `,false,function(){
                    console.log("catch------ ok");


                });

          };



          })
    };

    stepByStep();
    window.stepByStep=stepByStep;

};

function dplink(dpName,dataID,fSrc,type,count){
    let fileName='AnyDepartment';
    console.log("OK!----start---catch New BestSellers");
    ipcRenderer.send('catch',[fSrc,dataID,type,count]);
}


module.exports = {
    spider:spider,
    dplink:dplink

};
