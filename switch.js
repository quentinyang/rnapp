#!/usr/bin/env node

// ./switch.js dev

var args = process.argv;
var env = args[2] || 'dev';//dev or release. default  dev.
var fs = require("fs");

var releaseConfigs = require('./config/release.json');
var devConfigs = require('./config/dev.json');
var defaultConfigs = devConfigs;// code default is dev
var destConfigs;
console.log(args, env)



switch (env) {
    case 'release':
        destConfigs = releaseConfigs;
        break;
    case 'alpha':
        
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
            fs.writeFile(filepath, newContent, function(err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
    }catch(e) {
        console.log(e);
    }
}

// [codepush]
var cpConfigs = destConfigs.codepush;
replaceFileContent('ios/fy360/Info.plist', defaultConfigs.codepush.key, cpConfigs.key);
replaceFileContent('android/app/src/main/java/com/xinyi/fy360/MainActivity.java', defaultConfigs.codepush.key, cpConfigs.key);

// [GeTui]
var gtConfigs = destConfigs.getui;
// ios - unnecessary to do
// android
replaceFileContent('android/app/src/main/AndroidManifest.xml', [{
    find: defaultConfigs.getui.appId,
    replece: gtConfigs.appId,
}, {
    find: defaultConfigs.getui.appKey,
    replece: gtConfigs.appKey,
}, {
    find: defaultConfigs.getui.appSecret,
    replece: gtConfigs.appSecret,
}]);


// [UMeng]
var umConfigs = destConfigs.umeng;
// ios - unnecessary to do
// android
replaceFileContent('android/app/src/main/AndroidManifest.xml', [{
    find: defaultConfigs.umeng.android,
    replece: umConfigs.android,
}]);





// var program = require('commander');


// load configuration
// var options = require('../config');

// var program = require('commander');
// program
//   .version('1.1.3')
//   .option('-p, --production', 'In production')
//   .option('-P, --production', 'In production')
//   .option('-r, --rule [rule]', 'Rule name')
//   .option('-dev, --dev', 'In dev')
//   .option('-dir, --dir [dir]', 'Deploy to the dir', options.dir)
//   .option('-hash, --hash [hash]', 'Set hash dir', options.hash)
//   .option('-tmp, --tmp [tmp]', 'Set tmp dir', options.tmp)
//   .parse(process.argv);

// // after program defination.
// var args = program.args;
// var len = args.length;

// if (program.production) {
//     options.env = 'production';
// }
// if (program.dev) {
//     options.env = 'dev';
// }
// if (program.rule) {
//     options.rule = program.rule;
// }
// if (program.dir) {
//     options.dir = (/\/$/.test(program.dir)) ? program.dir : program.dir + '/';
// }
// if (program.hash) {
//     options.hash = (/\/$/.test(program.hash)) ? program.hash : program.hash + '/';
// }
// if (program.tmp) {
//     options.tmp = (/\/$/.test(program.tmp)) ? program.tmp : program.tmp + '/';
// }

// if (args[0]) {
//     options.app = args[0];//e.g.: app-site
// }
// if (args[1]) {
//     options.task = args[1];//e.g.: scripts
// }

// // options.argv = program;

// var Ufa = require('../ufa');// class Ufa
// var ufa = new Ufa();

// ufa.init(options);
// ufa.run();