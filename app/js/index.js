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

const department=require(path.join(__dirname, './department.js'));

const dataShow=require(path.join(__dirname, './datashow.js'));

const schedules=require(path.join(__dirname, './schedules.js'));

const bestdb=require(path.join(__dirname, './bestdb.js'));

var obj=remote.getGlobal('sharedObj');

//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
///////init button
dragFile();

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
          //console.log(html);
          schedules.email(subject,html);
        }

      }

});


//////////////////////

ipcRenderer.on('asynchronous-reply', function (event, arg) {
    console.log(arg) // prints "pong"
})

ipcRenderer.send('asynchronous-message', '------renderer--send-----ping------------')
ipcRenderer.sendSync('synchronous-message', '---synchronous-message---renderer--send-----ping------------')




var toolsButtons=$('.button-tools');
console.log("toolsBtns:-------"+ "/"+toolsButtons);

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
		   //toolsButton.className="nav-group-item button-tools";
		}
        $(buttonEl).addClass('active');
        //buttonEl.className="nav-group-item button-tools active";


        console.log("click btn------"+toolsID);

        ipcRenderer.send('click-button', {"0":toolsID});


        switch(toolsID){

              case "Department":
                    $('.department').show();
                    $('.add').hide();
                   if ($('#dpf').children().length==0) {
                        department.load("dpf");
                        bindElem("dpf");
                    }

                break;

              case "Setup":
                    $('.department').hide();
                    $('.add').show();


                    department.load("start");

                    $("#rankStart").click(function(){
                        console.log("startCatch");
                        catch_sched_rankStart(_URLS);
                    });


                    $('#start_look_product').click(function(){

                       console.log("start_look_product---click");


                       let targetDOM=$('.look_product_list').children(),
                           targetUrl=[],
                           tln=targetDOM.length;
                            console.log(targetDOM)
                       for (var i = 0; i < targetDOM.length; i++) {

                            tln--;
                            $(targetDOM[i]).addClass("isLooking");
                            targetUrl.push($(targetDOM[i]).attr('src'));

                            if (tln<=0) {

                                catch_sched_lookProduct(targetUrl);

                            }
                       }

                    });





                break;

              case "add":
                    add();
                break;

              case "DepartmentDataShow":
                    $("#startCatch").remove();
                    $('.department').hide();
                    $('.add').hide();
                    $('#topReviewersContent').hide();
                    $('#departmentData').show();

                    dataShow.showDepartment();

                break;

              case "ProductDataShow":
                      $("#startCatch").remove();
                      $('.department').hide();
                      $('.add').hide();
                      $('#departmentData').hide();
                      $('#topReviewersContent').hide();

                      $('#productData').show();

                      dataShow.showProduct();

                break;

              case "topReviewers":
                    $("#startCatch").remove();
                    $('.department').hide();
                    $('.add').hide();
                    $('#departmentData').hide();
                    $('#topReviewersContent').show();


                    //dataShow.showTReviewers();

                    $('#tpStart').click(function(){
                        let sF=$('#dpsFrom').val(),
                            sT=$('#dpsTo').val();
                        catch_sched_topReviewers(sF,sT);
                    });

                    $('#tpDetailStart').click(function(){
                        let sF=$('#dpsFrom').val(),
                            sT=$('#dpsTo').val();
                        catch_sched_topReviewers(sF,sT,'detail');
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
    //$('.addlist').append(html[0]);
    console.log($('.selected'));
    let type=$('.selected').attr('class').replace(/selected|hoverAni|list-group-item|\s/g,'');
    department.update('AnyDepartment',$('.selected').text(),$('.selected').attr('data'),$('.selected').attr('src'),type);
}


function dragFile(){
      var holder = document.getElementById('holder');
      holder.ondragover = function () {
        return false;
      };
      holder.ondragleave = holder.ondragend = function () {
        return false;
      };
      holder.ondrop = function (e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        console.log('File you dragged here is', file.path);
        return false;
      };
}

function bindElem(){

    let nextType;

     switch(arguments[0]){

        case "dpf":

            nextType="dpc";

            $("."+arguments[0]).on('click', function(){

                testSelected(this);

                testLoad("dpf",this);

                //catch_confirm($(this).attr('src'),$(this).attr('id'),0);

               // bindElem(nextType);

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

        }

    function bindElmdef(type,nxtype){
        //console.log($("."+type))
        $("."+type).on('click', function(){
                console.log(this)
                testSelected(this);
                console.log(type)
                testLoad(type,this);

               // catch_confirm($(this).attr('src'),$(this).attr('id'),1);

               // bindElem(nxtype);

            });
    }


}


function testLoad(type0,elem){

    let id,type;
     switch(type0){

        case "dpf":

            id="1";
            type="dpc"

 console.log(id);
            break;

        case "dpc":

            id="2";
            type="dpcc"
            console.log(id);

            break;

        case "dpcc":

            id="3";
            type="dpccc"
            console.log(id);

        break;


        }

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

                try {

                    department.load(type,file,eid);

                    department.loadPath(files);

                } catch (err) {
                    alert('需要下载')
                }

                // dpName,dataID,fSrc,type,count
                catch_confirm(etext,edata,esrc,etype,ecount);
                bindElem(type);

}


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


}

function catch_confirm(dpName,dataID,fSrc,type,count){
  //var r=confirm("Catch New BestSellers<br>"+arguments[4]);
    let fileName='AnyDepartment';
    console.log("OK!----start---catch New BestSellers");


    ipcRenderer.send('catch',[fSrc,dataID,type,count]);

    department.update(fileName,dpName,dataID,fSrc,type,count);



}
function catch_sched_stock(){
    let url=$('#stockURL').val();

    later.date.localTime();

            console.log("Now:"+new Date());

    var sched = later.parse.recur().every(60).minute(),
                t = later.setInterval(function() {
                    console.log("运行一次--------------"+new Date());
                    ipcRenderer.send('catch_stock',url);
                }, sched);

    setTimeout(function(){
               t.clear();
               console.log("Clear");
            },604800*1000);

    later.setTimeout(function() {}, sched)




}

function catch_sched(){

  later.date.localTime();

  console.log("Now:"+new Date());

  var sched = later.parse.recur().every(1).hour(),
      t = later.setInterval(function(){fn()}, sched);

  //setTimeout(fn(),1000);
  setTimeout(function() {
    console.log("BestSellers立刻运行一次--------------");
    fn();

  }, 1000)

  setTimeout(function(){
     t.clear();
     console.log("Clear");
  },604800*2000);
    function fn(){
    console.log("BestSellers运行一次--------------"+new Date());

            let html=$('.addlist').children();
            let ln=html.length;


            for (var i = html.length - 1; i >= 0; i--) {
                ln--;
                let esrc=$(html[i]).attr('src'),
                    etext=$(html[i]).text(),
                    eid=$(html[i]).attr('data'),
                    id="",
                    count=$(html[i]).attr('count');

                console.log(html[i]);


                  if (ln<=0) {

                        ipcRenderer.send('catch',[esrc,eid,id,count]);

                        department.update('AnyDepartment',etext,eid,esrc,id,count);

                        department.load("start");

                  };

            };

  }

}

function catch_sched_rankStart(){
  let urls=arguments;
  later.date.localTime();

  console.log("Now:"+new Date());

  var sched = later.parse.recur().every(1).hour(),
      t = later.setInterval(function(){fn()}, sched);

  //setTimeout(fn(),1000);
  setTimeout(function() {
    console.log("BestSellers立刻运行一次--------------");
    fn();

  }, 1000)

  setTimeout(function(){
     t.clear();
     console.log("Clear");
  },604800*2000);
    function fn(){
    console.log("BestSellers运行一次--------------"+new Date());
        //  bestdb.updateDP(urls);
          ipcRenderer.send('catch_rankStart',urls);

  }

}

function catch_sched_lookProduct(urls){

    later.date.localTime();

            console.log("Now:"+new Date());

    var sched = later.parse.recur().every(60).minute(),
                t = later.setInterval(function() {
                    console.log("catch_lookProduct运行一次--------------"+new Date());
                    ipcRenderer.send('catch_lookProduct',urls);
                }, sched);

    setTimeout(function(){
               t.clear();
               console.log("catch_sched_lookProduct_Clear");
            },604800*2000);

    setTimeout(function() {
      console.log("catch_lookProduct立刻运行一次--------------");
      ipcRenderer.send('catch_lookProduct',urls);
    }, 1000)




}

function catch_sched_topReviewers(sf,st,type){
    ipcRenderer.send('catch_topReviewers',['https://www.amazon.com/review/top-reviewers/ref=cm_cr_tr_link_',sf,st,type]);
}


ipcRenderer.on('click-button-reply', function (event, arg) {
  //console.log(arg) // prints
})
ipcRenderer.on('catch_stock-result-save-reply', function (event, arg) {
  $('.addlist').after('<p>'+arg+'</p>')
})
