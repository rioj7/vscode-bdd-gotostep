// check Python files

(function () {
  let stepBeginRE = new RegExp('@(?:given|when|then|step)\\s*\\(\\s*(?:parser\\.\\w+\\s*\\(\\s*)?(.*)');
  // @ts-ignore
  registerFileChecker(['.py'], (step, line) => {
    // @ts-ignore
    return checkLine(step, line, stepBeginRE);
  });
})();
