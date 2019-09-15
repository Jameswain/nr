#!/usr/bin/env node
const updateNotifier = require('update-notifier');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const { spawnSync } = require('child_process');
const utils = require('../index');
const pkg = require('./package.json');
const scripts = utils.getScripts();
const notifier = updateNotifier({pkg});
notifier.notify();
console.log(notifier.update);

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

if (!scripts) process.exit();

function searchScripts(answers, input) {
  input = input || '';
  return new Promise(function(resolve) {
    const fuzzyResult = fuzzy.filter(input, scripts);
    resolve(
      fuzzyResult.map(function(el) {
        return el.original;
      })
    );
  });
}

inquirer.prompt([
  {
    type: 'autocomplete',
    name: 'job',
    message: '请选择你要运行的命令：',
    source: searchScripts,
    pageSize: 10
  },
]).then(function({ job }) {
  spawnSync(`npm`, ['run', job], {stdio: 'inherit'});
});
