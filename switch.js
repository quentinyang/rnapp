#!/usr/bin/env node

var program = require('commander');
program
  .version('1.0.0')
  .option('-c, --channel [channel]', 'Deploy Android for the channel', 'AppStore')
  .parse(process.argv);

var args = program.args;
var env = args[0] || 'dev';//dev or release. default  dev.
var fs = require("fs");
var channel = program.channel || 'AppStore';

var releaseConfigs = require('./config/release.json');
var devConfigs = require('./config/dev.json');
var defaultConfigs = devConfigs;// code default is dev
var destConfigs;

switch (env) {
    case 'release':
        destConfigs = releaseConfigs;
        break;
    default:
        destConfigs = devConfigs;
        break;

}

/**
 * @param string filepath.
 * @param mixed findStr. string or array e.g.: [{'find': $find, 'replace': $replace}]
 * @param mixed replaceStr. string or undefined
 */
function replaceFileContent(filepath, findStr, replaceStr) {

    try{
        // read file
        fs.readFile(filepath, function(err, data) {
            if (err) {
                return console.error(err);
            }

            // replace content
            var newContent = data.toString();
            if (typeof replaceStr === 'string') {
                newContent = newContent.replace(new RegExp(findStr, 'g'), replaceStr);
            } else if(typeof findStr == 'object' && findStr.constructor == Array) {
                findStr.forEach(function(data) {
                    newContent = newContent.replace(new RegExp(data.find, 'g'), data.replace);
                });
            }

            // write back to the file
            fs.writeFileSync(filepath, newContent);
        });
    }catch(e) {
        console.log(e);
    }
}

// [codepush]
var cpConfigs = destConfigs.codepush;
replaceFileContent('ios/fy360/Info.plist', defaultConfigs.codepush.key, cpConfigs.key);
replaceFileContent('android/app/src/main/java/com/xinyi/fy360/MainActivity.java', defaultConfigs.codepush.key, cpConfigs.key);

// [GeTui] & [UMeng]
var gtConfigs = destConfigs.getui;
var umConfigs = destConfigs.umeng;

console.log('GT', gtConfigs)
console.log('UM', umConfigs)
console.log('Default', defaultConfigs)
// ios - unnecessary to do
// android
replaceFileContent('android/app/src/main/AndroidManifest.xml', [
    // [GeTui]
    {
        find: defaultConfigs.getui.appId,
        replace: gtConfigs.appId,
    }, {
        find: defaultConfigs.getui.appKey,
        replace: gtConfigs.appKey,
    }, {
        find: defaultConfigs.getui.appSecret,
        replace: gtConfigs.appSecret,
    }, 
    // [UMeng]
    {
        find: defaultConfigs.umeng.android,
        replace: umConfigs.android,
    }, {
        find: 'AppStore',
        replace: channel
    }
]);