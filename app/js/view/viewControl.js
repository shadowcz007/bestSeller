const path=require('path');
const bestdb=require(path.join(__dirname, '../bestdb.js'));
const {remote,ipcRenderer} = require('electron');
const dp=require(path.join(__dirname, '../departmentLink.js'));

function init() {

    bestdb.loadDepartment(function(json){
      //console.log(json);
      let dp=$('#dpf');
      dp.html('');
      let count=json.length;
      for (var i = 0; i <= json.length - 1; i++) {
        if (json[i].type=="dpf"||!json[i].type) {
          let linkd=json[i].link;
          dp.append("<li id="+json[i].data+" class='dpf list-group-item hoverAni' src="+linkd+` data=`+json[i].data+` count=`+json[i].count+`>
            <div class='media-body'><strong>`+json[i].title+`</strong></div></li>
            `);
          let dpcJson=json[i].children;
          for (let j = 0; j < dpcJson.length; j++) {
            dp.append("<li id="+dpcJson[j].data+" class='dpc list-group-item hoverAni' src="+dpcJson[j].link+` data=`+dpcJson[j].data+`>
              <div class='media-body'><strong>`+dpcJson[j].title+`</strong></div></li>
              `);

              if (dpcJson[j].children) {
                  let dpccJson=dpcJson[j].children;
                  let id=dpcJson[j].data;
                  for (let q = 0; q < dpccJson.length; q++) {
                    $('#'+id).append("<li id="+dpccJson[q].data+" class='dpcc list-group-item hoverAni' src="+dpccJson[q].link+` data=`+dpccJson[q].data+`>
                      <div class='media-body'><strong>`+dpccJson[q].title+`</strong></div></li>
                      `);

                      if (dpccJson[q].children) {
                        let dpcccJson=dpccJson[q].children;
                        let id=dpccJson[q].data;
                        for (let p = 0; p < dpcccJson.length; p++) {
                          $('#'+id).append("<li id="+dpcccJson[p].data+" class='dpccc list-group-item hoverAni' src="+dpcccJson[p].link+` data=`+dpcccJson[p].data+`>
                            <div class='media-body'><strong>`+dpcccJson[p].title+`</strong></div></li>
                            `);
                          }
                        };
                 }
          };
        };
        };
      };
      bindElem('dpf')
      bindElem('dpc')
    });
}

function getStarted(){
  $('#Page_GetStart').show();
  $('#Page_departmentData').hide();
  $('#Page_setup').hide();
  $('#Page_productData').hide();
  $('#Page_topReviewersContent').hide();
};

function bindElem(){
    let nextType;
     switch(arguments[0]){
        case "dpf":
            nextType="dpc";
            $("."+arguments[0]).on('click', function(){
                testSelected(this);
                testLoad("dpf",this);
            });
            break;
        case "dpc":
            nextType="dpcc";
            bindElmdef("dpc",nextType);
            break;
        case "dpcc":
            nextType="dpccc";
            bindElmdef("dpcc",nextType);
            break;
        };

    function bindElmdef(type,nxtype){
        $("."+type).on('click', function(){
                testSelected(this);
                testLoad(type,this);
				});
    };


};
function testSelected(elem){
    let dp=$(elem).attr('class').replace(/list-group-item|hoverAni|selected|\s/ig,'');
    let dps=$('.'+dp);
    if (elem) {
        for (var i = $('.selected').length - 1; i >= 0; i--) {
                $($('.selected')).removeClass('selected');
            };
        var classN=$(elem).hasClass('selected');

        if (!classN) {
            $(elem).addClass('selected');
            console.log("add selected")
        }
    }else{
        return $('.selected').attr('data')
    };
};
function testLoad(type0,elem){
    let id,type;
     switch(type0){
        case "dpf":
            id="1";
            type="dpc"
            break;

        case "dpc":
            id="2";
            type="dpcc"
            break;
        case "dpcc":
            id="3";
            type="dpccc"
        break;
			};

    let elems=$(elem),
        eid=elems.attr('id'),
        edata=elems.attr('data'),
        esrc=elems.attr('src'),
        ecount=elems.attr('count'),
        etype=elems.attr('class').replace(/list-group-item|hoverAni|selected|\s/ig,''),
        etext=elems.text(),
        file=path.join(`${__dirname}`,'../js/data/'+eid+'.json'),
        files=path.join(`${__dirname}`,'../js/data/'+edata+'/');

                ipcRenderer.send('click-button','{"'+id+'":"'+eid+'"}');

                dp.dplink(etext,edata,esrc,etype,ecount);
                bindElem(type);
}

function setup(){
  $('#Page_departmentData').hide();
  $('#Page_setup').show();
  $('#Page_productData').hide();
  $('#Page_topReviewersContent').hide();
  $('#Page_GetStart').hide();
}
function topReviewers(){
  $('#Page_departmentData').hide();
  $('#Page_setup').hide();
  $('#Page_productData').hide();
  $('#Page_topReviewersContent').show();
  $('#Page_GetStart').hide();
}
function departmentDataShow(){
  $('#Page_departmentData').show();
  $('#Page_setup').hide();
  $('#Page_productData').hide();
  $('#Page_topReviewersContent').hide();
  $('#Page_GetStart').hide();

  $('.selectedRank').html('');



  bestdb.loadRank(function (docs) {
      //console.log(docs);
      window._URLS=[];
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
            //  console.log(docs.length)
              window._URLS.push(urlsToTran.dr());
              _URLS=_URLS.dr()
            };
        }
        dpBrief(docs[i],'.selectedRank');
      };
    });
};
function updateInfo(obj,elem){
  $(elem).append(`
    <p>`+new Date()+`</p>
    <p>`+obj+`</p>
    `)
}
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
    <li id=`+obj.data+` class='list-group-item db' src=`+obj.link+` count=`+obj.count+`>
      <div class='media-body'>
        <strong>`+obj.title+`</strong>
        <p>`+'Looks : '+obj.count+`</p>
        <p>`+'Children: '+obj.links.length+`</p>
      </div>
    </li>
  `);

  bestdb.loadRankOfProduct(obj.data,function(e){
    //  console.log(e);
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
  $('#Page_GetStart').hide();

  $('#PD_lineStack').html('');
  $('.look_product_list').html('');




  bestdb.load("look_product","all",function (docs) {
      //console.log(docs);
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
    init:init,
      getStarted:getStarted,
      setup:setup,
      topReviewers:topReviewers,
       departmentDataShow:departmentDataShow,
       productDataShow:productDataShow,
       addLPList:addLPList,
       addChartDOM:addChartDOM,
       updateInfo:updateInfo

  };
