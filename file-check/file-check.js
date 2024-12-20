const vscode = require("vscode");

let fileCheckers = new Map();
let variableGroupReplacement = '(?:.*?)';

function getFileChecker(extension) {
  return fileCheckers.get(extension);
}

function registerFileChecker(extensions, checker) {
  for (const ext of extensions) {
    fileCheckers.set(ext, checker);
  }
}

function isCaptureGroup(text) { return text === '(?P' || text === '('; }

/** @param {string} text  @returns {string} */
function replaceCaptureGroups(text) {
  // keep track if in capture group
  let result = '';
  let stack = [];
  let rePartRE = new RegExp(/(\\.|[^()])*/, 'g');
  let nextParenRE = new RegExp(/\)|\(\?(:|[=!]|<[=!]|P(?=<\w+>))|\(/, 'g');
  let insideCaptureGroup = 0;
  let match;
  while ((match = rePartRE.exec(text)) !== null) {
    if (insideCaptureGroup === 0) { result += match[0]; }
    if (rePartRE.lastIndex === text.length) { break; }
    nextParenRE.lastIndex = rePartRE.lastIndex;
    if ((match = nextParenRE.exec(text)) === null) { break; } // should never happen
    if (match[0] === ')') {
      if (insideCaptureGroup === 0) { result += match[0]; }
      if (stack.length > 0) {
        let openPar = stack.pop();
        if (insideCaptureGroup > 0 && isCaptureGroup(openPar)) {
          --insideCaptureGroup;
          if (insideCaptureGroup === 0) { result += variableGroupReplacement;}
        }
      }
    } else {
      stack.push(match[0]);
      if (isCaptureGroup(match[0])) {
        ++insideCaptureGroup;
      }
      if (insideCaptureGroup === 0) { result += match[0]; }
    }
    rePartRE.lastIndex = nextParenRE.lastIndex;
  }
  return result;
}

var checkLine = (function () {
  let stripRegexpRE = new RegExp('/\\^?(.*?)\\$?/');
  let stripStringRE = /("""|'''|'|")((?:\\.|.)*?)\1/;
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
          try {
            let regexStrResult = regexStr.replace(/\{.*?\}/g, variableGroupReplacement);
            regexStrResult = replaceCaptureGroups(regexStrResult);
            return (new RegExp(regexStrResult, 'i')).test(step);
          } catch (e) {
            if (e instanceof SyntaxError) {
              vscode.window.showErrorMessage(`Error creating RegExp from: ${line} - ${e.name}: ${e.message}`);
              return false;
            }
            throw e;
          }
        }
      }
    }
    lineBuffer = undefined;
    return false;
  }
})();

module.exports = { getFileChecker };
