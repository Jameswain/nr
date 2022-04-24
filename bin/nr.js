#!/usr/bin/env node
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const { sync } = require('cross-spawn');
const utils = require('../index');
const scripts = utils.getScripts();
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

const notifier = updateNotifier({ pkg });  // 默认为1天检查一次
notifier.notify({ isGlobal: true });
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
if (process.argv[2] && ['-v', '-version', '--version'].includes(process.argv[2])) {
  console.log(pkg.version);
} else if (scripts) {
  inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'job',
      message: '请选择你要运行的命令：',
      pageSize: 10,
      source: (answers, input) => {
        input = input || '';
        return new Promise(function(resolve) {
          const fuzzyResult = fuzzy.filter(input, scripts);
          resolve(
            fuzzyResult.map(function(el) {
              return el.original;
            })
          );
        });
      },
    }
  ]).then(function({ job }) {
    sync('npm', ['run', job], {stdio: 'inherit'});
  });
}