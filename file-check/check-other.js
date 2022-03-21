// check JavaScript/TypeScript/Java/Ruby/Kotlin/Scala/Lua files

(function () {
  let stepBeginRE = new RegExp('(?:Given|When|Then)\\s*\\(\\s*(.*)');
  // @ts-ignore
  registerFileChecker(['.js', '.ts', '.java', '.rb', '.kt', '.scala', '.lua'], (step, line) => {
    // @ts-ignore
    return checkLine(step, line, stepBeginRE);
  });
})();
