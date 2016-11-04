const path=require('path');
const bestdb=require(path.join(__dirname, '../bestdb.js'));

function departmentDataShow(){
  $('#Page_departmentData').show();
  $('#Page_setup').hide();
  $('#Page_productData').hide();
  $('#Page_topReviewersContent').hide();
  $('.department').hide();

  $('.selectedRank').html('');


  window._URLS=[];
  bestdb.loadRank(function (docs) {
      console.log(docs);

      for (var i = 0; i < docs.length; i++) {

        let urlsToTran=[],
            doc=docs[i].children || '';
            if (docs[i].links!=null) {
                urlsToTran.push(docs[i].links);
            }

        let lnlr=doc.length;
        for (let t = 0; t < doc.length; t++) {
            lnlr--;

            if (doc[t].links!=null) {
                urlsToTran.push(doc[t].links);
            };

            if(lnlr<=0){
              console.log(docs.length)
              window._URLS.push(urlsToTran.dr());
              _URLS=_URLS.dr()
            };
        }
        dpBrief(docs[i],'.selectedRank');
      };
    });
};

function addLPList(obj,elem) {
  obj.data=obj.data || 0;
  obj.img=obj.img || 0;
  obj.title=obj.title || obj.link.replace(/.*product\/|\/ref=.*/gi,'');
  obj.ranks_lp=obj.ranks_lp || [];
  obj.time_lp=obj.time_lp || new Date();

  $(elem).append(`
    <li class='list-group-item' src=`+obj.link+` data=`+obj.data+`>
    <img class="media-object pull-left" src=`+obj.img+` width="72" >
    <div class='media-body'>
    <strong>`+'Product Title : '+obj.title+`</strong>
    <p>`+'Looks : '+obj.ranks_lp.length+`</p>
    <p>`+'Rank : '+obj.rank_lp+`</p>
    <p>`+'First Date : '+obj.firstDate+`</p>
    <p>`+'Update : '+obj.time_lp+`</p>
    <p>`+'ASIN : '+obj.ASIN+`</p>
    <p>`+'Keywords : '+obj.keywords+`</p>
    <p>`+'Url : '+obj.link+`</p>
    </div>
    </li>`);
}

function addChartDOM(index,chartType,elem) {
  $(elem).append(`
      <div class='charts'>
        <div id=`+chartType+'_'+index+'_img'+`></div>
        <div id=`+chartType+'_'+index+` class=`+chartType+`></div>
        </div>
    `)
}
function addLPBrief(obj,elem) {
  let title=[];
  for (var i = 0; i < obj.length; i++) {
      title.push('<br>'+obj[i].title);
  }
  $(elem).append(`
    <li class='list-group-item'>
    <div class='media-body'>
    <strong>Product Title :</strong>
    <p>`+title+`</p><br>
    <strong>`+'Products : '+obj.length+`</strong>
    </div>
    </li>`);
}

function dpBrief(obj,elem) {
  $(elem).append(`
    <li id=`+obj.data+` class='list-group-item' src=`+obj.link+` count=`+obj.count+`>
      <div class='media-body'>
        <strong>`+obj.title+`</strong>
        <p>`+'Looks : '+obj.count+`</p>
        <p>`+'Children: '+obj.links.length+`</p>
      </div>
    </li>
  `);

  bestdb.loadRankOfProduct(obj.data,function(e){
      console.log(e);
      let g=e||'';
      let count=g.length || 0;
      $('#'+obj.data).append(`
              <p>`+'Product Numbers : '+count+`</p>
      `);
  });
}



function productDataShow() {

  $('#Page_departmentData').hide();
  $('#Page_setup').hide();
  $('#Page_productData').show();
  $('#Page_topReviewersContent').hide();
  $('.department').hide();

  $('#PD_lineStack').html('');
  $('.look_product_list').html('');


console.log(bestdb)

  bestdb.load("look_product","all",function (docs) {
      console.log(docs);
      addLPBrief(docs,'.look_product_list');

  });

}







function tranformArray(array) {
	console.log(JSON.stringify(array))
  var c = JSON.stringify(array).replace(/\[|\]/g,'').split(",");
	console.log(c.length)
  return c;

}


  module.exports = {
       departmentDataShow:departmentDataShow,
       productDataShow:productDataShow,
       addLPList:addLPList,
       addChartDOM:addChartDOM

  };
