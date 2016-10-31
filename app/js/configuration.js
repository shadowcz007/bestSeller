'use strict';

var nconf = require('nconf').file({file:`file://${__dirname}/data/AnyDepartment.json`});

function saveSettings(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
}

function readSettings(settingKey) {
    console.log(`file://${__dirname}/data/AnyDepartment.json`)
    nconf.load();
    console.log(nconf.get(settingKey))
console.log(nconf)
   // return nconf.get(settingKey);
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
    saveSettings: saveSettings,
    readSettings: readSettings
};

