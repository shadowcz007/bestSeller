const path=require('path');

const {remote,ipcRenderer} = require('electron');
const bestdb=require(path.join(`${__dirname}`,'../js/bestdb.js'));

var obj=remote.getGlobal('sharedObj');
let webviews=$('#webviews');


function topAll() {


let url=obj.topReviewersUrl[0],
    sf=obj.topReviewersUrl[1],
    st=obj.topReviewersUrl[2],
    urls=[];

for (var i = sf; i <parseInt(st)+1; i++) {
  urls.push(url+i+'?ie=UTF8&page='+i);
}

let lns=urls.length;
console.log(lns);
let s=0;

var stepByStep=function () {

  webviews.html(`
        <h3 class=lpTitle>`+(s+1)+`</h3>
        <webview class='lpWebview' id=tr`+s+` src=`+urls[s]+` useragent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36' nodeintegration>
        </webview>
    `);

  let webview=document.getElementById('tr'+s);
console.log(webview)
  webview.addEventListener('dom-ready', function () {
          webview.openDevTools();
          webview.executeJavaScript(`
            const path=require('path');
            console.log(path.join('`+`${__dirname}`+`','../js/bestdb.js'));
            const bestdb=require(path.join('`+`${__dirname}`+`','../js/bestdb.js'));

            const {ipcRenderer,remote} = require('electron');

            var links=document.links,result,ln=links.length;
            var regName=/_name/ig,
                regNext=/Next »/ig;

            for(var i=0;i<=links.length-1;i++){
              ln--;

              if(regName.test(links[i].href)){

               var DOM=document.getElementById('reviewer'+links[i].href.replace(/.*tbl_|_name/g,''));
                result={link:links[i].href,
                              name:links[i].innerText,
                              rank:links[i].href.replace(/.*tbl_|_name/g,''),
                              time:Date(),
                              userID:links[i].href.replace(/.*profile\\/|\\/ref.*/g,''),
                              totalReviews:DOM.cells[3].innerText.replace(/,/g,''),
                              hfVotes:DOM.cells[4].innerText.replace(/,/g,''),
                              percentHelpful:DOM.cells[5].innerText.replace(/%/g,'')
                          };
                          bestdb.topReviewers(result);
                          console.log(JSON.stringify(result,null,2));
              }

            if(ln<=0){

            }
            }
          `,false,function(){

            console.log("catch topReviewers ok");
            console.log(s+'~~~'+Date());
            s++;
            if (s<lns) {
              console.log(s)
              console.log(lns)
              let _TIME=22000+Math.random()*100000;
              console.log(_TIME/1000);
              setTimeout("stepByStep()",_TIME)

            }


            });

  });

}

stepByStep();
window.stepByStep=stepByStep;

}

function detail() {
  console.log('topReviewers detail');
  let taskLink=[];

  let sf=obj.topReviewersUrl[1],
      st=obj.topReviewersUrl[2];

  bestdb.topReviewers('',function (docs) {

          for (var i = sf; i < parseInt(st)+1; i++) {
              taskLink.push(docs[i].link);
          }
          console.log(taskLink.length);

          let ln=taskLink.length;
          let s=0;

          var stepByStep_detail=function() {

            webviews.html(`
                  <h3 class=lpTitle>`+(s+1)+`</h3>
                  <webview class='lpWebview' id=tr`+s+` src=`+taskLink[s]+` useragent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36' nodeintegration>
                  </webview>
              `);

            let webview=document.getElementById('tr'+s);
          //console.log(webview);

            webview.addEventListener('dom-ready', function () {
            
                    webview.openDevTools();
                    webview.executeJavaScript(`
                      const path=require('path');
                      console.log(path.join('`+`${__dirname}`+`','../js/bestdb.js'));
                      const bestdb=require(path.join('`+`${__dirname}`+`','../js/bestdb.js'));



                      var result={},reviewsContent=[];
                           result['avatar']=document.getElementsByClassName('pr-avatar-decorator')[0].getElementsByTagName('img')[0].src;
                           if(document.getElementsByClassName('list-count')[0]){
                           result['wListCount']=document.getElementsByClassName('list-count')[0].innerText.replace(/\\(|\\)/g,'');}
                           result['userID']=document.URL.replace(/.*profile\\/|\\/ref=.*/ig,'');
                           if(document.getElementsByClassName('location-and-occupation-holder')[0]){
                           result['location']=document.getElementsByClassName('location-and-occupation-holder')[0].innerText.replace(/\\n/ig,'');}
                           result['bioExpander']=document.getElementsByClassName('bio-expander')[0].innerText.replace(/\\n/ig,'').replace(/Helpful votes.*/ig,'');
                           var rTitle=document.getElementsByClassName('glimpse-product-title');
                           var rDate=document.getElementsByClassName('glimpse-raw-timestamp');

                           var lnt=rTitle.length;
                           for(var i=0;i<rTitle.length;i++){
                             lnt--;
                             console.log(lnt);

                              reviewsContent.push({
                               'title':rTitle[i].innerText,
                               'date':rDate[i].innerText
                              });
                              console.log(reviewsContent);
                               if(lnt<=0){
                                 result['reviewsContent']=reviewsContent;

                               }

                           }

                           bestdb.topReviewers(result);
                           console.log(JSON.stringify(result,null,2));

                    `,false,function(){

                      console.log("catch topReviewers_detail ok");
                      console.log(s+'~~~'+Date());
                      s++;
                      if (s<ln) {
                        let _TIME=22000+Math.random()*100000;
                        console.log(_TIME/1000);
                        setTimeout("stepByStep_detail()",_TIME)

                      }


                      });

            });

          };

          stepByStep_detail();
          window.stepByStep_detail=stepByStep_detail;






  })
}

module.exports = {

    topAll:topAll,
		detail:detail




};
