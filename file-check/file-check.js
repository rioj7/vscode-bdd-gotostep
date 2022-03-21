let fileCheckers = new Map();

function getFileChecker(extension) {
  return fileCheckers.get(extension);
}

function registerFileChecker(extensions, checker) {
  for (const ext of extensions) {
    fileCheckers.set(ext, checker);
  }
}

var checkLine = (function () {
  let stripRegexpRE = new RegExp('/\\^?(.*?)\\$?/');
  let stripStringRE = /u?("""|'''|'|")(.*?)\1/;
  let lineBuffer = undefined;
  return (step, line, stepBeginRE, options) => {
    if (!options) { options = {}; }
    if (lineBuffer) {
      line = `${lineBuffer} ${line}`;
    }
    let result = line.match(stepBeginRE);
    if (result !== null) {
      let stepDesc = result[1];
      if (stepDesc.length === 0) {
        if (lineBuffer === undefined) {
          lineBuffer = line;
          return false;
        }
      } else {
        let regexStr = undefined;
        // is it a string or a regex
        if (stepDesc[0] === '/') {
          result = stepDesc.match(stripRegexpRE);
          if (result !== null) {
            regexStr = result[1];
          }
        } else {
          result = stepDesc.match(stripStringRE);
          if (result !== null) {
            regexStr = result[2];
            if (options.stringStripCaretDollar) {
              let start = 0;
              let end = regexStr.length;
              if (regexStr.startsWith('^')) { ++start; }
              if (regexStr.endsWith('$')) { --end; }
              regexStr = regexStr.substring(start, end);
            }
            if (options.cleanupRegex) {
              regexStr = regexStr.replaceAll('\\\\', '\\');
            }
          }
        }
        if (regexStr) {
          lineBuffer = undefined;
          return (new RegExp(regexStr.replace(/\{.*?\}/g, '.*?'), 'i')).test(step);
        }
      }
    }
    lineBuffer = undefined;
    return false;
  }
})();

module.exports = { getFileChecker };
