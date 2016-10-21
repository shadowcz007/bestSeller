


const fs = require('fs-extra');
const path=require('path');
const {remote,ipcRenderer} = require('electron');




module.exports = {
    loadDB: loadDB,    
    saveDB: saveDB
    
};