const path = require('path');
module.exports = {
  getScripts() {
    try {
      const package = require(path.resolve(process.cwd(), 'package.json'));
      if (package.scripts) return Object.keys(package.scripts);
    } catch (e) {
    }
  }
}
