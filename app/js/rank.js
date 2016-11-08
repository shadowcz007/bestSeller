const path=require('path');

const {remote,ipcRenderer} = require('electron');
const bestdb=require(path.join(`${__dirname}`,'../js/bestdb.js'));

var obj=remote.getGlobal('sharedObj');
let webviews=$('#webviews');


function spider() {

let urls=creatUrls(obj.rankStart).reverse(),
    lns=urls.length;
 console.log(urls);


function creatUrls(arg) {
  let pageNum=[1,2,3,4,5],urls=[];
  let link=arg[0];
  for (var y = 0; y < link.length; y++) {
    let url0=link[y].replace(/\/ref=.*/g,'');
    for (let i = pageNum.length - 1; i >= 0; i--) {
        let url=url0+"/ref=zg_bs_apparel_pg_"+pageNum[i]+"?_encoding=UTF8&pg="+pageNum[i]+"&ajax=1&isAboveTheFold=";
        urls.push(url+0,url+1);
        if (y>=link.length-1 && i<=0) {
              return urls;
        }
    };
  }
}

let s=0;

var stepByStep=function () {
console.log(urls[s]);

  webviews.html(`
        <h3 class=lpTitle>`+(s+1)+`</h3>
        <webview class="lpWebview" id=tr`+s+` src=`+urls[s]+`" useragent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36' nodeintegration></webview>
         `);
console.log(s)
  let webview=document.getElementById('tr'+s);
console.log(webview)

  webview.addEventListener('dom-ready', function () {
    //webview.openDevTools();
          webview.executeJavaScript(`
            const path=require('path');
            console.log(path.join('`+`${__dirname}`+`','../js/bestdb.js'));
            const bestdb=require(path.join('`+`${__dirname}`+`','../js/bestdb.js'));

            var html=document.getElementsByClassName("zg_itemImmersion"),
                ln=html.length,
                bs=[],
                index=document.URL;

            for (var i = html.length - 1; i >= 0; i--) {
                  ln--;
                  var rank=html[i].getElementsByClassName("zg_rankDiv")[0].innerText.replace('.','');
                  var img;
                  var link,review,price,title,star;
                  if(html[i].getElementsByTagName("img")[0]){
                    img=html[i].getElementsByTagName("img")[0].getAttribute("src");
                  }
                  if(html[i].getElementsByClassName("zg_title")[0]){
                    link=html[i].getElementsByClassName("zg_title")[0].getElementsByTagName("a")[0].getAttribute("href").replace(/\\n/ig,'');
                    title=html[i].getElementsByClassName("zg_title")[0].innerText
                  }
                  if(html[i].getElementsByClassName("zg_reviews")[0]){
                    review=html[i].getElementsByClassName("zg_reviews")[0].innerText.replace(/ out of 5 stars |,/g,'');}
                  if(html[i].getElementsByClassName("zg_price")[0]){
                    price=html[i].getElementsByClassName("zg_price")[0].innerText;}

                  if(html[i].getElementsByClassName("a-link-normal")[0]){
                    link=html[i].getElementsByClassName("a-link-normal")[0].getAttribute("href").replace(/\\n|\\//ig,'');
                    title=html[i].getElementsByClassName("a-link-normal")[0].innerText;
                    if(html[i].getElementsByClassName("a-link-normal")[1]){
                      star=html[i].getElementsByClassName("a-link-normal")[1].innerText.replace(/out.*|\\s/ig,'');
                    }
                    if(html[i].getElementsByClassName("a-link-normal")[2]){
                      review=html[i].getElementsByClassName("a-link-normal")[2].innerText.replace(/,/ig,'');
                    }
                    if(html[i].getElementsByClassName("a-row")[0]){
                    price=html[i].getElementsByClassName("a-row")[0].innerText.replace(/Prime/ig,'');
                    }

                  }

                    if(!review){
                     review='0';
                   }
                   if(!price){
                     price='0';
                   }
                  if(!link){
                     link='0';
                   }
                    console.log(review);
                      console.log(price);
                  bs.push({
                      "department":document.URL.replace(/.*best-sellers-|\\/zgbs.*/ig,'').toLowerCase(),
                    "time":new Date(),
                    "rank":rank,
                    "img":img,
                    "title":title,
                    "link":link,
                    "data":link.replace(/.*amazon\\.com\\/|\\/dp.*/g,''),
                    "review":review.replace(/.*\\(|\\)/g,''),
                    "star":star,
                    "priceMin":price.replace(/-.*|\\$|\\n|\\s/g,''),
                    "priceMax":price.replace(/.*-|\\$|\\n|\\s/g,'')
                  });
                  var data={
                    "department":document.URL.replace(/.*best-sellers-|\\/zgbs.*/ig,'').toLowerCase(),
                    "time":new Date(),
                    "rank":rank,
                    "img":img,
                    "title":title,
                    "link":link,
                    "data":link.replace(/.*amazon\\.com\\/|\\/dp.*/g,'').toLowerCase(),
                    "review":review.replace(/.*\\(|\\)/g,''),
                    "star":review.replace(/\\(.*/g,''),
                    "priceMin":price.replace(/-.*|\\$|\\n|\\s/g,''),
                    "priceMax":price.replace(/.*-|\\$|\\n|\\s/g,'')
                  };

                  bestdb.updateRank(data);
                if (ln==0) {

                    console.log(JSON.stringify(bs,null,2));
                };
              }

          `,false,function(){

          //  console.log("catch rank product ok");
            console.log(s+'~~~'+Date());
            s++;
            if (s<lns) {
              console.log(s)
              console.log(lns)
              let _TIME=4000+Math.random()*20000;
              ipcRenderer.send('result',"catch rank "+s+" product ok, next "+Math.ceil(_TIME/1000)+' second');
              //console.log(_TIME/1000);
              setTimeout("stepByStep()",_TIME)

            }


            });

  });

}

 stepByStep();
window.stepByStep=stepByStep;

}



function tranformArray(array) {
  var c = JSON.stringify(array).replace(/\[|\]/g,'').split(",");
  return c;
}

module.exports = {

    spider:spider




};
