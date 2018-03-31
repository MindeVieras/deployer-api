'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

var directory = {
    root: rootPath,
    distDir: rootPath + '/dist',
    assetsDir: rootPath + '/public'
};

exports.default = directory;