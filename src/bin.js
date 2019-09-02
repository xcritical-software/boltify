#!/usr/bin/env node
'use strict';

var ver = process.versions.node;
var majorVer = parseInt(ver.split('.')[0], 10);
var cli;

if (majorVer < 8) {
  throw new Error(
    'Node version ' +
      ver +
      ' is not supported in mono-ci, please use Node.js 8.0 or higher.'
  );
} else {
  cli = require('./cli').default;
}

cli(process.argv.slice(2), true);
