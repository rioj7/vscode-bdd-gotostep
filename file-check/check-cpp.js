// check C++ files

(function () {
  let stepBeginRE = new RegExp('(?:GIVEN|WHEN|THEN)\\s*\\(\\s*(.*)');
  // @ts-ignore
  registerFileChecker(['.cpp', '.cxx', '.cc', '.c++', '.cp', '.C'], (step, line) => {
    // @ts-ignore
    return checkLine(step, line, stepBeginRE, {stringStripCaretDollar: true, cleanupRegex: true});
  });
})();
