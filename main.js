
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
                      count:""
                    
                    };
 //selected:["name",0]  
 //0,1,2,3,4
 //0--mainbtn,1--dpf,2--dpc,3-dpcc                 
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
 // createCatchWindow (); 
  createMainWindow();
}
function createMainWindow () {
   
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame:true,
    resizable: false,
    //alwaysOnTop:true,
    title:'BestSellers',
    titleBarStyle:'hidden-inset',
   // fullscreen:true,
   //backgroundColor:'#80FFFFFF',
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

  //读取 index.html ，设置path位置.
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)
  
  mainWindow.webContents.openDevTools()
  
  mainWindow.on('closed', function () {    
    mainWindow = null
  })
}

let amazonWindow;
function createAmazonWindow () {
  
  amazonWindow = new BrowserWindow({
    frame:true,
    resizable: true,
    alwaysOnTop:true,
    title:'Catch',
    x:1,
    y:1,
    titleBarStyle:'hidden-inset',
    closable:true,
    movable:true,
    width: 100,
    height: 100,
    
    webPreferences: {
        experimentalFeatures:true,
       // experimentalCanvasFeatures:true,
        plugins: true,
        nodeIntegration: true,//这句是使用node 模块
        //webSecurity: false,
        //preload: path.join(__dirname, '../../inject/preload.js'),
      }
  })

  //amazonWindow.loadURL('https://www.amazon.com/Best-Sellers-Appliances/zgbs/appliances/ref=zg_bs_nav_0')
  
  amazonWindow.loadURL(`file://${__dirname}/app/tpl/amazon.html`)

  // Open the DevTools.
  amazonWindow.webContents.openDevTools()
/*

  amazonWindow.webContents.on('did-finish-load', () => {
  amazonWindow.webContents.savePage('tmp/test.html', 'HTMLOnly', (error) => {
    if (!error) console.log('Save page successfully')
  })
  })
*/

 
  amazonWindow.on('closed', function () {
    amazonWindow = null
  })
}

//
let stockWin;
function createStockWindow () {
  // Create the browser window.
  stockWin = new BrowserWindow({
    frame:false,
    resizable: true,
    alwaysOnTop:false,
    title:'stock',
    titleBarStyle:'hidden-inset',
   // fullscreen:true,
   //backgroundColor:'#80FFFFFF',
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
        //webSecurity: false,
        //preload: path.join(__dirname, '../../inject/preload.js'),
      }
  })

  //读取 index.html ，设置path位置.
  stockWin.loadURL(`file://${__dirname}/app/tpl/stock.html`)

  // Open the DevTools.
   stockWin.webContents.openDevTools()

   
  stockWin.on('closed', function () {
     
    stockWin = null
  })
}



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
  if (amazonWindow==null) {
    createAmazonWindow();
  }else{
    amazonWindow.reload();
    //amazonWindow.focusOnWebView();
  };
  
    global.sharedObj.dpf=arg;
    global.sharedObj.type=arg[2];
    global.sharedObj.count=arg[3];

  event.sender.send('catch-bestseller',arg);

});

ipcMain.on('catch-result-save',function (event, arg) {
  
 
 //mainWindow.reload();

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


app.on('ready', createWindow)

 
app.on('window-all-closed', function () {
   
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
   
  if (mainWindow === null) {
    createWindow()
  }
})

 