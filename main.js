
const electron = require('electron');
const ipcMain = require('electron').ipcMain;
const path=require('path');
const bestdb=require('./app/js/bestdb.js');
ipcMain._maxListeners=200;

global.sharedObj = {myvar: "hellofrommainjs",
                    result:"1",
                    selected:{
                          "0":"",
                          "1":"",
                          "2":"",
                          "3":""
                      },
                      bestSellers:{"index":0,
                          "0":"",
                          "1":"",
                          "2":"",
                          "3":"",
                           "4":"",
                          "5":"",
                          "6":"",
                          "7":"",
                           "8":"",
                          "9":"",
                          "10":"",
                          "11":""

                      },
                      count:"",
                      productWinUrls:""
                    };

const app = electron.app
const BrowserWindow = electron.BrowserWindow

/////////////////////////////////
/*
** mainWin主窗口：分类浏览、抓取任务设定、数据可视化。。。
** productWin窗口：监测某个产品，定时爬取信息。。。
** bestSellersWin窗口：监测某个排行榜的窗口，定时爬取。。。
** topReviewersWin
**
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

let mainWin,departmentWin,bestSellersWin,stockWin,productWin,topReviewersWin;

function createWindow () {
  createMainWin();
  SpiderWin.init();
}
function createMainWin () {
  mainWin = new BrowserWindow({
    frame:true,
    resizable: false,
    title:'BestSellers',
    titleBarStyle:'hidden-inset',
    width: 1280,
    height: 800,
    'accept-first-mouse': true,
    webPreferences: {
        experimentalFeatures:true,
        experimentalCanvasFeatures:true,
        plugins: true,
        nodeIntegration: true,//这句是使用node 模块
      }
  });
  mainWin.loadURL(`file://${__dirname}/app/index.html`);
  mainWin.on('closed', function () {
    mainWin = null
  })
}

var option={
           show:false,
            backgroundColor:'#66CD00',
            frame: false,
            resizable: true,
            alwaysOnTop:true,
            x:100,
            y:100,
            width: 40,
            height: 40,
            webPreferences: {
                experimentalFeatures:true,
                plugins: true,
                nodeIntegration: true,//这句是使用node 模块
              }
            };
            var option2={
                        backgroundColor:'#ffffff',
                        frame: false,
                        resizable: true,
                        alwaysOnTop:true,
                        movable:true,
                        x:20,
                        y:800,
                        width: 500,
                        height: 60,
                        webPreferences: {
                            experimentalFeatures:true,
                            plugins: true,
                            nodeIntegration: true,//这句是使用node 模块
                          }
                        };

function createBestSellersWin () {
  bestSellersWin = new BrowserWindow(option)
  bestSellersWin.loadURL(`file://${__dirname}/app/tpl/rank.html`)
  bestSellersWin.on('closed', function () {
    bestSellersWin = null
  })
}



var SpiderWin ={
    init:function(){
          this.win= new BrowserWindow(option2);
          this.win.loadURL(`file://${__dirname}/app/tpl/spiderWin.html`);
          this.win.on('closed', function () {
            this.win = null
          });
         }

}

//


function createDepartmentWin () {
  departmentWin = new BrowserWindow(option)
  departmentWin.loadURL(`file://${__dirname}/app/tpl/department.html`)
  departmentWin.on('closed', function () {
    departmentWin = null
  })
}

//

function createStockWindow () {
  // Create the browser window.
  stockWin = new BrowserWindow({
    show:false,
    frame:false,
    resizable: true,
    alwaysOnTop:false,
    title:'stock',
    titleBarStyle:'hidden-inset',
    width: 300,
    height: 300,
    x:0,
    y:0,
    center:false,
    webPreferences: {
        experimentalFeatures:true,
        experimentalCanvasFeatures:true,
        plugins: true,
        nodeIntegration: true,//这句是使用node 模块
      }
  })
  stockWin.loadURL(`file://${__dirname}/app/tpl/stock.html`)
//  stockWin.webContents.openDevTools()
  stockWin.on('closed', function () {
    stockWin = null
  })
}

/////look productWin

function createProductWindow () {
  productWin = new BrowserWindow(option);
  productWin.loadURL(`file://${__dirname}/app/tpl/product.html`)
  //productWin.webContents.openDevTools();
  productWin.on('closed', function () {
    productWin = null
  });
};


/////topReviewersWin

function createTopReviewersWindow () {
  topReviewersWin = new BrowserWindow(option);
  topReviewersWin.loadURL(`file://${__dirname}/app/tpl/topReviewers.html`)
  //topReviewersWin.webContents.openDevTools();
  topReviewersWin.on('closed', function () {
    topReviewersWin = null
  });
};

/////////////////ipcMain
/*
*  click-button
*  click-button-reply
*
*  asynchronous-message
*  asynchronous-reply
*  synchronous-message

*  catch
*  catch-bestseller
*
*  catch-result-save
*  catch-result-save-reply
*
*  catch_stock
*  catch_stock_result
*
*  catch_stock-result-save
*
*  catch_lookProduct,打开createProductWindow();
*

*/


ipcMain.on('click-button', function (event, arg) {
  console.log(arg);
  let arg0;
  if (typeof(arg)=="string") {
    arg0=JSON.parse(arg);
  }else{
    arg0=arg;
  };
  let key=Object.keys(arg0);
  switch(key[0]){
      case "0":
        global.sharedObj.selected["0"]=arg0["0"];
        global.sharedObj.selected["1"]="";
        global.sharedObj.selected["2"]="";
        global.sharedObj.selected["3"]="";
        break;

      case "1":
        global.sharedObj.selected["1"]=arg0["1"];
        global.sharedObj.selected["2"]="";
        global.sharedObj.selected["3"]="";
        break;

      case "2":
        global.sharedObj.selected["2"]=arg0["2"];
        global.sharedObj.selected["3"]="";
        break;

      case "3":
        global.sharedObj.selected["3"]=arg0["3"];
        break;

      default:
        break;
  }


  console.log(global.sharedObj.selected);

  event.sender.send('click-button-reply', arg0);

})

ipcMain.on('catch_rankStart',function (event, arg) {
  console.log(arg);
  if (bestSellersWin==null) {
    createBestSellersWin();
  }else{
    bestSellersWin.reload();
  };
    global.sharedObj.rankStart=arg;
    SpiderWin.win.webContents.send('spiderWin', '爬取产品数量'+arg[0].length*100)
});

ipcMain.on('result',function (event, arg) {
  console.log('result~~~~~~~~~~~~~'+arg);
  SpiderWin.win.webContents.send('spiderWin', 'result~~~~~~~~~~~~~'+arg)
});


ipcMain.on('catch-result-save',function (event, arg) {
  //console.log("catch-result-save----------from-webview"+JSON.stringify(arg[1]).replace(/\\n/g,''));
  //console.log(path.join(`${__dirname}`,'app/js/data/test1.json'))
  let index=arg[0].replace(/.*\/Best-Sellers-|\/zgbs.*/ig,'')+'/'+global.sharedObj.count+"/"+arg[0].replace(/.*pg=|&ajax.*=/ig,'');
  let DP=arg[0].replace(/.*\/Best-Sellers-|\/zgbs.*/ig,'');
  let counts=global.sharedObj.count;
  let bs=JSON.stringify(arg[1]).replace(/\\n/g,'');
  let json=JSON.parse(bs);
  for (var i = json.length - 1; i >= 0; i--) {
    json[i].title=json[i].title.replace(/.*.com\/|\/dp.*/ig,'');
  };
  bestdb.update(DP,counts,json);
})

ipcMain.on('catch_stock',function (event, arg) {
//  console.log(arg);
   global.sharedObj.stockURL=arg;
  if (stockWin==null) {
    createStockWindow();
  }else{
    stockWin.reload();
  };

  event.sender.send('catch_stock_result',arg);

});

ipcMain.on('catch_stock-result-save',function (event, arg) {
  let time=new Date();
  let fileName=time.getMonth()+"m"+time.getDate()+"d"+time.getHours()+'h'+time.getMinutes()+'min';
  //fs.outputJson(path.join(`${__dirname}`,'app/js/data/stock/'+fileName+'.json'),arg);
  event.sender.send('catch_stock-result-save-reply',path.join(`${__dirname}`,'app/js/data/stock/'+fileName+'.json'));

})

ipcMain.on('catch_lookProduct',function (event, args) {
  console.log(args);
  global.sharedObj.productWinUrls=args;
  if (productWin==null) {
    createProductWindow();
  }else{
    productWin.reload();
  };
  SpiderWin.win.webContents.send('spiderWin', '爬取产品数量'+args[0].length)

});

ipcMain.on('catch_topReviewers',function (event, args) {
  //console.log(args);
  global.sharedObj.topReviewersUrl=args;
  global.sharedObj.topReviewers=args[3];
  if (topReviewersWin==null) {
    createTopReviewersWindow();
  }else{
    topReviewersWin.reload();
  };
  SpiderWin.win.webContents.send('spiderWin', '爬取数量'+args[0].length)

});

ipcMain.on('catch',function (event, arg) {
  //console.log(arg);
  if (departmentWin==null) {
    createDepartmentWin();
  }else{
    departmentWin.reload();
    //bestSellersWin.focusOnWebView();
  };

    global.sharedObj.dpf=arg;
    global.sharedObj.type=arg[2];
    global.sharedObj.count=arg[3];

  event.sender.send('catch-bestseller',arg);

});


app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  if (mainWin === null) {
    createWindow()
  }
});
