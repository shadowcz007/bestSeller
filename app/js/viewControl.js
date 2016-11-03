const path=require('path');
const bestdb=require(path.join(__dirname, '../bestdb.js'));

function departmentDataShow(){
  $('#Page_departmentData').show();
  $('#Page_setup').hide();
  $('#Page_productData').hide();
  $('#Page_topReviewersContent').hide();
  $('.department').hide();



  $('.selectedRank').html('');

  bestdb.loadRank(function (docs) {
      console.log(docs);
      let urlsToTran=[],lnlr=docs.length;
      for (var i = 0; i < docs.length; i++) {
        lnlr--;
        let linkd=docs[i].link;

        urlsToTran.push(docs[i].links);

        $('.selectedRank').append(`
          <li id=`+docs[i].data+` class='list-group-item' src=`+linkd+` count=`+docs[i].count+`>
            <div class='media-body'>
              <strong>`+docs[i].title+`</strong>
              <p>`+'Looks : '+docs[i].count+`</p>
              <p>`+'Number: '+linkd.length+`</p>
              <p>`+'Update : '+docs[i].time+`</p>
            </div>
          </li>
        `);
        if(lnlr<=0){
          let pd=docs[i].data;
          console.log(docs.length)

            window._URLS=tranformArray(urlsToTran);


          bestdb.loadRankOfProduct(pd,function(e){
              console.log(e)
              $('#'+pd).after(`
                      <p>`+'Numbers : '+e+`</p>
              `);
          });
        };
      };
    });
};

function productDataShow() {
  $('#Page_departmentData').hide();
  $('#Page_setup').hide();
  $('#Page_productData').show();
  $('#Page_topReviewersContent').hide();
    $('.department').hide();


  //////////// load from db
  bestdb.load("look_product","all",function (docs) {
      console.log(docs);
      $('.look_product_list').html('');
      for (var i = 0; i < docs.length; i++) {

        $('.look_product_list').append(`
          <li class='list-group-item' src=`+docs[i].link+` data=`+docs[i].title+`>
          <img class="media-object pull-left" src=`+docs[i].img+` width="32" height="32">
          <div class='media-body'>
          <strong>`+docs[i].title+`</strong>
          <p>`+'Looks : '+docs[i].ranks_lp.length+`</p>
          <p>`+'Now : '+docs[i].rank_lp+`</p>
          <p>`+'Update : '+docs[i].time_lp+`</p>

          </div>
          </li>`);
      }


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
       productDataShow:productDataShow

  };
