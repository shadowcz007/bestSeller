const path=require('path');
const {remote,ipcRenderer} = require('electron');
const bestdb=require(path.join(`${__dirname}`,'../js/bestdb.js'));

var obj=remote.getGlobal('sharedObj');
let webviews=$('#webviews');

function spider() {

        let lpUrls=obj.productWinUrls,
            lns=lpUrls.length;
         console.log(lpUrls);

        let s=0;

        var stepByStep=function () {

            webviews.html(`
                  <h3 class=lpTitle>`+lpUrls[s].replace(/.*.com\/|\/dp.*|-/ig,' ')+`</h3>
                  <webview class='lpWebview' id=lp`+s+` src=`+lpUrls[s]+` useragent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36' nodeintegration>
                  </webview>
              `);

          let webview=document.getElementById('lp'+s);
          console.log(webview)
          webview.addEventListener('dom-ready', function () {
                  webview.openDevTools();
                  webview.executeJavaScript(`
                    const path=require('path');
                    console.log(path.join('`+`${__dirname}`+`','../js/bestdb.js'));
                    const bestdb=require(path.join('`+`${__dirname}`+`','../js/bestdb.js'));

                  const {ipcRenderer,remote} = require('electron');

                  var result={};
                  if(document.getElementById('acrCustomerReviewText') && document.getElementById('reviewStarsLinkedCustomerReviews')){
                    result['review']=document.getElementById('acrCustomerReviewText').innerText.replace(/customer.*|\\s|,/ig,'');
                    result['star']=document.getElementById('reviewStarsLinkedCustomerReviews').innerText.replace(/out.*|\\s/ig,'');

                  }

                  var price0=0;


                  if(document.getElementById('priceblock_saleprice')){
                    price0=document.getElementById('priceblock_saleprice').innerText.replace(/\\$/ig,'');
                    result['priceMin']=price0.replace(/-.*|\\s/ig,'');
                    result['priceMax']=price0.replace(/.*-|\\s/ig,'');
                  }

                  if(document.getElementById('priceblock_ourprice')){

                      price0=document.getElementById('priceblock_ourprice').innerText.replace(/\\$/ig,'');
                      result['priceMin']=price0.replace(/-.*|\\s/ig,'');
                      result['priceMax']=price0.replace(/.*-|\\s/ig,'');
                  }

                  result['priceMin']=result['priceMax']=0;




                  var regBest=/sellers rank/ig,
                      regReviews=/customer reviews/ig,
                      regASIN=/ASIN/ig,
                      regDF=/Date first available/ig;

                  var pDOM=document.getElementsByTagName('meta'),
                      ulDOM=document.getElementById('detailBullets_feature_div').children[0].children,
                      trDOM=document.getElementsByTagName('tr');
                  var sizeDOM,colorDOM;

                  var rank,reviews,title,size=[],color=[];

                      if(document.getElementById('native_dropdown_selected_size_name')){
                        sizeDOM=document.getElementById('native_dropdown_selected_size_name').children;
                        for(var i=1;i<sizeDOM.length;i++){
                        size.push(sizeDOM[i].innerText.replace(/\\s{2}/ig,''));
                        };
                        result['size']=size;
                      }

                      if(document.getElementById('variation_color_name') && document.getElementById('variation_color_name').children[1]){

                        colorDOM=document.getElementById('variation_color_name').children[1].children;
                        for(var i=1;i<colorDOM.length;i++){
                        color.push(colorDOM[i].getAttribute('title').replace(/.*select|\\s/ig,''));
                        };
                        result['color']=color;
                      }else if(document.getElementById('variation_color_name')){
                          colorDOM=document.getElementById('variation_color_name').children[0].innerText;
                          result['color']=colorDOM;
                      }




                  result['time']=Date();
                  for (var u=0;u<=pDOM.length-1;u++){
                    if(pDOM[u].getAttribute('name')=='keywords'){
                       result['keywords']=pDOM[u].getAttribute('content');
                    }
                  }
                  for (var j=0;j<=ulDOM.length-1;j++){

                    var ostr=ulDOM[j].innerText;
                    var cTest=regASIN.test(ostr),
                        dTest=regDF.test(ostr);
                    if(cTest){
                      result['ASIN']=ostr.replace(/ASIN:|\\s/ig,'');
                      console.log(result['ASIN']);
                    };
                    if(dTest){
                      result['firstDate']=new Date(ostr.replace(/.*:/ig,''));
                      console.log(result['firstDate']);
                    }
                  }
                  let url00=document.getElementsByTagName('link')[6].getAttribute('href');
                  result['url']=url00;
                  result['img']=document.getElementById('landingImage').getAttribute('src');
                  result['data']=url00.replace(/.*.com\\/|\\/dp.*/ig,'').toLowerCase();
                  result['title']=document.getElementById('productTitle').innerText;
                  for(var i=0;i<=trDOM.length-1;i++){
                  var str=trDOM[i].innerText;
                  var bTest=regBest.test(str),
                      aTest=regReviews.test(str);
                  if(aTest){
                    reviews=str.replace(/\\n.*/g,'');
                    result['reviews']=reviews;
                  }
                  if(bTest){
                  rank=trDOM[i].innerText.replace(/Best Sellers Rank|\\n|\\s/ig,' ').replace(/\\s{2,}/g,'');
                  rank=rank.split('#').slice(1);
                  result['rank']=rank;

                  }else{
                  otherBest();
                  };

                  };
                  function otherBest(){
                  var salesRank=document.getElementById('SalesRank').innerText.replace(/amazon Best Sellers Rank:|\\n|\\s/ig,' ').replace(/\\s{2,}/g,'');;

                  salesRank=salesRank.split('#').slice(1);
                  result['rank']=salesRank;

                  }
                  console.log(result);

                  bestdb.lookProduct([{data:result['data']},{link:document.URL}],'updateProduct',result);

                  console.log(JSON.stringify(result,null,2));

                  `,false,function(){

                    console.log("catch------product ok");
                    console.log(s+'~~~'+Date());
                    s++;
                    if (s<lns) {
                      console.log(s)
                      console.log(lns)
                      let _TIME=4000+Math.random()*10000;
                      console.log(_TIME/1000);
                      setTimeout("stepByStep()",_TIME)

                    }
              });

          });

        };

    stepByStep();
    window.stepByStep=stepByStep;

};


module.exports = {
    spider:spider

};
