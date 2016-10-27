
const electron = require('electron')
const ipcMain = require('electron').ipcMain

const path=require('path');
const fs = require('fs-extra');

const bestdb=require('./app/js/bestdb.js');

ipcMain._maxListeners=100;
console.log(ipcMain._maxListeners)

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
 //selected:["name",0]
 //0,1,2,3,4
 //0--mainbtn,1--dpf,2--dpc,3-dpcc
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


/////////////////////////////////
/*
** mainWin主窗口：分类浏览、抓取任务设定、数据可视化。。。
** productWin窗口：监测某个产品，定时爬取信息。。。
** bestSellersWin窗口：监测某个排行榜的窗口，定时爬取。。。
**
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


let mainWin,bestSellersWin,stockWin,productWin;

function createWindow () {
  createMainWin();
}
function createMainWin () {

  mainWin = new BrowserWindow({
    frame:true,
    resizable: false,
    //alwaysOnTop:true,
    title:'BestSellers',
    titleBarStyle:'hidden-inset',
   // fullscreen:true,

    width: 1280,
    height: 800,
    'min-width': 500,
    'min-height': 500,
    'accept-first-mouse': true,
    webPreferences: {
        experimentalFeatures:true,
        experimentalCanvasFeatures:true,
        plugins: true,
        nodeIntegration: true,//这句是使用node 模块
        //webSecurity: false,
        //preload: path.join(__dirname, '../../inject/preload.js'),
      }
  })

  mainWin.loadURL(`file://${__dirname}/app/index.html`)
  mainWin.webContents.openDevTools()
  mainWin.on('closed', function () {
    mainWin = null
  })
}


function createBestSellersWin () {
  bestSellersWin = new BrowserWindow({
    frame:true,
    resizable: true,
    alwaysOnTop:true,
    title:'bestSellers',
    x:1,
    y:1,
    titleBarStyle:'hidden-inset',
    closable:true,
    movable:true,
    width: 100,
    height: 100,
    webPreferences: {
        experimentalFeatures:true,
        plugins: true,
        nodeIntegration: true,//这句是使用node 模块
      }
  })
  //bestSellersWin.loadURL('https://www.amazon.com/Best-Sellers-Appliances/zgbs/appliances/ref=zg_bs_nav_0')

  bestSellersWin.loadURL(`file://${__dirname}/app/tpl/amazon.html`)
  // Open the DevTools.
  bestSellersWin.webContents.openDevTools()
/*
  bestSellersWin.webContents.on('did-finish-load', () => {
  bestSellersWin.webContents.savePage('tmp/test.html', 'HTMLOnly', (error) => {
    if (!error) console.log('Save page successfully')
  })
  })
*/
  bestSellersWin.on('closed', function () {
    bestSellersWin = null
  })
}

//

function createStockWindow () {
  // Create the browser window.
  stockWin = new BrowserWindow({
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
  stockWin.webContents.openDevTools()
  stockWin.on('closed', function () {
    stockWin = null
  })
}

/////look productWin

function createProductWindow () {
  productWin = new BrowserWindow({
    //frame:false,
    resizable: true,
    alwaysOnTop:false,
    title:'product',
    titleBarStyle:'hidden-inset',
    width: 400,
    height: 400,
    x:0,
    y:0,
    center:false,
    webPreferences: {
        experimentalFeatures:true,
        plugins: true,
        nodeIntegration: true//这句是使用node 模块
      }
  });
  productWin.loadURL(`file://${__dirname}/app/tpl/product.html`)
  productWin.webContents.openDevTools();
  productWin.on('closed', function () {
    productWin = null
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

ipcMain.on('asynchronous-message', function (event, arg) {
  console.log(arg)  // prints "ping"

  event.sender.send('asynchronous-reply', '-----main-sender-send----pong---------')
})

ipcMain.on('synchronous-message', function (event, arg) {
  console.log(arg)  // prints "ping"
  event.returnValue = 'main-returnValue-----pong---------'
})

ipcMain.on('catch',function (event, arg) {
  console.log(arg);
  if (bestSellersWin==null) {
    createBestSellersWin();
  }else{
    bestSellersWin.reload();
    //bestSellersWin.focusOnWebView();
  };

    global.sharedObj.dpf=arg;
    global.sharedObj.type=arg[2];
    global.sharedObj.count=arg[3];

  event.sender.send('catch-bestseller',arg);

});

ipcMain.on('catch-result-save',function (event, arg) {
 //mainWin.reload();
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
  fs.outputJson(path.join(`${__dirname}`,'app/js/data/'+index.toLowerCase()+'.json'),json);
  console.log("fsjout --------json------------from webview--"+path.join(`${__dirname}`,'app/js/data/'+index.toLowerCase()+'.json'))

  bestdb.update(DP,counts,json);

  //event.sender.send('catch-result-save-reply',[index,bs]);

})

ipcMain.on('catch_stock',function (event, arg) {
  console.log(arg);
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

  fs.outputJson(path.join(`${__dirname}`,'app/js/data/stock/'+fileName+'.json'),arg);

  console.log("fsjout --------json------------from webview--"+path.join(`${__dirname}`,'app/js/data/stock/'+fileName+'.json'))

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

  //event.sender.send('catch_lookProduct_result',args);

});







app.on('ready', createWindow)


app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {

  if (mainWin === null) {
    createWindow()
  }
})
