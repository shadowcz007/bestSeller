/////////////////////////////////
/*
**
**绑定按钮，所有功能性的按钮动作绑定
dpf,dpc
click
**
**
**
**
**
**
**
**
*/
/////////////////////////////

'use strict'


const path=require('path');

const fs = require('fs-extra');

const later = require('later');

const {remote,ipcRenderer} = require('electron');

const Menu = remote.Menu;

const MenuItem = remote.MenuItem;


const dataShow=require(path.join(__dirname, './datashow.js'));

const schedules=require(path.join(__dirname, './schedules.js'));

const bestdb=require(path.join(__dirname, './bestdb.js'));

const viewControl=require(path.join(__dirname, './view/viewControl.js'));

var obj=remote.getGlobal('sharedObj');

//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
///////init button
//dragFile();

viewControl.init()




$('.start_email').click(function(){
  let content=$(this).parent().clone(),
      subject=content.attr('id');

    let canvas=content.find('canvas'),
        chartImg=content.find('.chartImg');
    let ln=canvas.length;
    for (var i = 0; i < canvas.length; i++) {
      ln--;
      $(canvas[i]).parent().parent().remove();
      $(chartImg[i]).show();
      if (ln<=0) {
        let html=content.html();
        console.log(html);
        schedules.email(subject,html);
      }

    }
});


//////////////////////

var toolsButtons=$('.button-tools');
//console.log("toolsBtns:-------"+ "/"+toolsButtons);

for (let i = 0; i < toolsButtons.length; i++) {
    var toolsButton = toolsButtons[i];
    var toolsID = $(toolsButton).attr('id');
    prepareButton(toolsButton, toolsID);
}


function prepareButton(buttonEl, toolsID) {

    buttonEl.addEventListener('click', function () {

        for (let i = 0; i < toolsButtons.length; i++) {
  		    let toolsButton = toolsButtons[i];
              $(toolsButton).removeClass('active');
		    }
        $(buttonEl).addClass('active');
      //  console.log("click btn------"+toolsID);
        ipcRenderer.send('click-button', {"0":toolsID});

        switch(toolsID){

              case "GetStarted":
                  viewControl.getStarted();
                break;

              case "Setup":
                  viewControl.setup();
                break;

              case "DepartmentDataShow":
                      viewControl.departmentDataShow();

                      $('#rankStar').click(function(){
                          let val=$('#rankStarSelect').find("option:selected").val();
                          dataShow.showDepartment2(val);
                      });
                      $("#rankStart").click(function(){
                          $('#Info_departmentData').text("DepartmentData,start"+new Date());
                          $('#rankStart').unbind("click");
                          schedules.rankStart(_URLS);

                      });
                break;

              case "ProductDataShow":
                      viewControl.productDataShow();
                      dataShow.showProduct();

                      $('#start_look_product').click(function(){
                          bestdb.load("look_product","all",function (docs) {
                              console.log(docs);
                              let targetDOM=$('.look_product_list')[0],
                                  targetUrl=[],
                                  tln=docs.length;
                                  $(targetDOM).addClass("isLooking");
                              for (var i = 0; i < docs.length; i++) {
                                   tln--;
                                   targetUrl.push(docs[i].link);
                                   if (tln<=0) {
                                       schedules.lookProduct(targetUrl);
                                   } }
                          });
                      });

                      $('#add_look_product').click(function(){
                          let link=$('#add_lp_url').val();
                          if (link) {
                            //viewControl.addLPList({link:link},'.look_product_list');
                            bestdb.lookProduct(link,"addList",{link:link})
                            //viewControl.productDataShow();
                          }else{
                            alert('f')
                          }

                      });


                break;

              case "topReviewers":
                  viewControl.topReviewers()
                    //dataShow.showTReviewers();

                    $('#tpStart').click(function(){
                        let sF=$('#dpsFrom').val(),
                            sT=$('#dpsTo').val();
                        schedules.topReviewers(sF,sT);
                    });

                    $('#tpDetailStart').click(function(){
                        let sF=$('#dpsFrom').val(),
                            sT=$('#dpsTo').val();
                        schedules.topReviewers(sF,sT,'detail');
                    });
                break;

              default:
                break;
        }






    });

}



function add(){
    let html=$('.selected').clone(true);
    html.removeClass('selected hoverAni').unbind("click");
    console.log($('.selected'));
    let type=$('.selected').attr('class').replace(/selected|hoverAni|list-group-item|\s/g,'');

}

function catch_confirm(dpName,dataID,fSrc,type,count){
    let fileName='AnyDepartment';
    console.log("OK!----start---catch New BestSellers");
    ipcRenderer.send('catch',[fSrc,dataID,type,count]);
}
