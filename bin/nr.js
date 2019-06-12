#!/usr/bin/env node
const inquirer = require('inquirer');
const utils = require('../index');
const {spawn} = require('child_process');
(async () => {
  const choices = utils.getScripts();
  if (choices) {
    const {job} = await inquirer.prompt([{
      type: 'list',
      message: '请选择你要运行的命令:',
      name: 'job',
      choices,
      pageSize: 10
    }]);
    
    const npm = spawn(`npm`, ['run', job], {stdio: 'inherit'});
  } else {
    process.exit();
  }
})();
