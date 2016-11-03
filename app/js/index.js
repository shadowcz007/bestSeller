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

const department=require(path.join(__dirname, './department.js'));

const dataShow=require(path.join(__dirname, './datashow.js'));

const schedules=require(path.join(__dirname, './schedules.js'));

const bestdb=require(path.join(__dirname, './bestdb.js'));

const viewControl=require(path.join(__dirname, './view/viewControl.js'));

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
        console.log(html);
        schedules.email(subject,html);
      }

    }
});


//////////////////////

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
		    }
        $(buttonEl).addClass('active');
        console.log("click btn------"+toolsID);
        ipcRenderer.send('click-button', {"0":toolsID});

        switch(toolsID){

              case "Department":
                    $('.department').show();
                    $('.add').hide();
                    department.load("dpf");
                break;

              case "Setup":
                    $('#Page_departmentData').hide();
                    $('#Page_setup').show();
                    $('#Page_productData').hide();
                    $('#Page_topReviewersContent').hide();
                    $('.department').hide();

                break;

              case "add":
                    add();
                break;

              case "DepartmentDataShow":
                      viewControl.departmentDataShow();

                      $('#rankStar4').click(function(){
                          dataShow.showDepartment2('3.5');
                      });
                      $("#rankStart").click(function(){
                          console.log("startCatch");
                          schedules.rankStart(_URLS);
                      });
                break;

              case "ProductDataShow":
                      viewControl.productDataShow();
                      dataShow.showProduct();

                      $('#start_look_product').click(function(){
                         let targetDOM=$('.look_product_list').children(),
                             targetUrl=[],
                             tln=targetDOM.length;
                              console.log(targetDOM)
                         for (var i = 0; i < targetDOM.length; i++) {
                              tln--;
                              $(targetDOM[i]).addClass("isLooking");
                              targetUrl.push($(targetDOM[i]).attr('src'));
                              if (tln<=0) {
                                  schedules.lookProduct(targetUrl);
                              } }
                      });
                break;

              case "topReviewers":
                    $('#Page_departmentData').hide();
                    $('#Page_setup').hide();
                    $('#Page_productData').hide();
                    $('#Page_topReviewersContent').show();
                    $('.department').hide();
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



function catch_confirm(dpName,dataID,fSrc,type,count){
    let fileName='AnyDepartment';
    console.log("OK!----start---catch New BestSellers");
    ipcRenderer.send('catch',[fSrc,dataID,type,count]);
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

var template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function () {
          return (process.platform === 'darwin') ? 'Ctrl+Command+F' : 'F11'
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          } else {
            return 'Ctrl+Shift+I'
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) focusedWindow.toggleDevTools()
        }
      }
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: function () { require('electron').shell.openExternal('http://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  var name = require('electron').remote.app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () { app.quit() }
      }
    ]
  })
  // Window menu.
  template[3].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  )
}

var menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
