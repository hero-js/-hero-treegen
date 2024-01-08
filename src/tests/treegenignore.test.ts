let i = 1;

function gitignorePatternToRegExp(pattern: string): RegExp {
  // Échapper les caractères spéciaux en RegExp
  const escapedPattern = pattern
    .replace(/\\/g, '\\\\') // Échapper les backslashes
    .replace(/\./g, '\\.') // Échapper les points
    .replace(/\*(?<!\]\*)/g, '.*') // Remplacer * par .*
    .replace(/\?/g, '[^/]?') // Remplacer ? par .
    .replace(/\[([^\/]*)\]\*/g, `[$1]*`);

  // Remplacer les astérisques consécutifs par un seul astérisque
  const startCharPattern = /\/\.\*$/.test(escapedPattern)
    ? `^${escapedPattern}`
    : escapedPattern;
  const endBySingleSlashPattern = startCharPattern.replace(
    /\/\.\*$/,
    '(/[^/]+)*/?$'
  );
  const singleSlashPattern = endBySingleSlashPattern.replace(
    /\/(\.\*)+\//g,
    '(?:/[^/]+)*/'
  );
  const singleAsteriskPattern = singleSlashPattern.replace(
    /(\/)?(\.\*)+(\/)?/g,
    '.*'
  );
  const startByslashPattern = singleAsteriskPattern.replace(/^\//, '^/?');
  // Construire l'expression régulière
  // const regExpPattern = `^${singleAsteriskPattern}$`;
  const regExpPattern = startByslashPattern;

  console.log(i++ + ': ' + regExpPattern);

  return new RegExp(regExpPattern);
}

describe('Ignore patterns', () => {
  it('Test pattern: **/logs', () => {
    const gitignorePattern = '**/logs';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('logs/monday/foo.bar')).toBe(true);
    expect(regExp.test('build/logs/debug.log')).toBe(true);
    expect(regExp.test('logs/debug/info.log')).toBe(true);
    expect(regExp.test('source/code.js')).toBe(false);
  });

  it('Test pattern: **/logs/debug.log', () => {
    const gitignorePattern = '**/logs/debug.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('build/logs/debug.log')).toBe(true);
    expect(regExp.test('logs/build/debug.log')).toBe(false);
    expect(regExp.test('logs/debug/info.log')).toBe(false);
    expect(regExp.test('source/code.js')).toBe(false);
  });

  it('Test pattern: *.log', () => {
    const gitignorePattern = '*.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debug.log')).toBe(true);
    expect(regExp.test('trace.log')).toBe(true);
    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('.log')).toBe(true);
    expect(regExp.test('trace-log')).toBe(false);
  });

  it('Test pattern: !important.log', () => {
    const gitignorePattern = '!important.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('important.log')).toBe(false);
    expect(regExp.test('logs/important.log')).toBe(false);
  });

  it('Test pattern: *.log', () => {
    const gitignorePattern = '*.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('trace.log')).toBe(true);
    expect(regExp.test('debug.log')).toBe(true);
    expect(regExp.test('important/trace.log')).toBe(true);
  });

  it('Test pattern: !important/*.log', () => {
    const gitignorePattern = '!important/*.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('important/debug.log')).toBe(false);
  });

  it('Test pattern: /debug.log', () => {
    const gitignorePattern = '/debug.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debug.log')).toBe(true);
    expect(regExp.test('/debug.log')).toBe(true);
    expect(regExp.test('logs/debug.log')).toBe(false);
  });

  it('Test pattern: debug.log', () => {
    const gitignorePattern = 'debug.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debug.log')).toBe(true);
    expect(regExp.test('logs/debug.log')).toBe(true);
  });

  it('Test pattern: debug?.log', () => {
    const gitignorePattern = 'debug?.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debug.log')).toBe(true);
    expect(regExp.test('debug0.log')).toBe(true);
    expect(regExp.test('debugg.log')).toBe(true);
    expect(regExp.test('debug10.log')).toBe(false);
  });

  it('Test pattern: debug[0-9].log', () => {
    const gitignorePattern = 'debug[0-9].log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debug0.log')).toBe(true);
    expect(regExp.test('debug1.log')).toBe(true);
    expect(regExp.test('debug10.log')).toBe(false);
  });

  it('Test pattern: debug[01].log', () => {
    const gitignorePattern = 'debug[01].log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debug0.log')).toBe(true);
    expect(regExp.test('debug1.log')).toBe(true);
    expect(regExp.test('debug2.log')).toBe(false);
    expect(regExp.test('debug01.log')).toBe(false);
  });

  it('Test pattern: debug[!01].log', () => {
    const gitignorePattern = 'debug[!01].log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debug2.log')).toBe(true);
    expect(regExp.test('debug0.log')).toBe(false);
    expect(regExp.test('debug1.log')).toBe(false);
    expect(regExp.test('debug01.log')).toBe(false);
  });

  it('Test pattern: debug[a-z].log', () => {
    const gitignorePattern = 'debug[a-z].log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('debuga.log')).toBe(true);
    expect(regExp.test('debugb.log')).toBe(true);
    expect(regExp.test('debug1.log')).toBe(false);
  });

  it('Test pattern: logs', () => {
    const gitignorePattern = 'logs';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs')).toBe(true);
    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('logs/latest/foo.bar')).toBe(true);
    expect(regExp.test('build/logs')).toBe(true);
    expect(regExp.test('build/logs/debug.log')).toBe(true);
  });

  it('Test pattern: logs/*', () => {
    const gitignorePattern = 'logs/*';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('logs/latest/foo.bar')).toBe(true);
    expect(regExp.test('build/logs/foo.bar')).toBe(false);
    expect(regExp.test('build/logs/latest/debug.log')).toBe(false);
  });

  it('Test pattern: logs/', () => {
    const gitignorePattern = 'logs/';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('logs/important.log')).toBe(true);
  });

  it('Test pattern: !logs/important.log', () => {
    const gitignorePattern = '!logs/important.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(false);
    expect(regExp.test('logs/important.log')).toBe(false);
  });

  it('Test pattern: logs/important.log', () => {
    const gitignorePattern = 'logs/important.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(false);
    expect(regExp.test('logs/important.log')).toBe(true);
  });

  it('Test pattern: logs/**/debug.log', () => {
    const gitignorePattern = 'logs/**/debug.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('logs/monday/debug.log')).toBe(true);
    expect(regExp.test('logs/monday/pm/debug.log')).toBe(true);
  });

  it('Test pattern: logs/*day/debug.log', () => {
    const gitignorePattern = 'logs/*day/debug.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/monday/debug.log')).toBe(true);
    expect(regExp.test('logs/tuesday/debug.log')).toBe(true);
    expect(regExp.test('logs/latest/debug.log')).toBe(false);
  });

  it('Test pattern: /logs/debug.log', () => {
    const gitignorePattern = '/logs/debug.log';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('logs/debug.log')).toBe(true);
    expect(regExp.test('debug.log')).toBe(false);
    expect(regExp.test('build/logs/debug.log')).toBe(false);
  });

  it('Test pattern: report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json', () => {
    const gitignorePattern = 'report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('report.123.456.789.0.json')).toBe(true);
    expect(regExp.test('report.abc.123.456.58.json')).toBe(false);
    expect(regExp.test('report.1.2.3.4.json')).toBe(true);
  });

  it('Test pattern: **/foo', () => {
    const gitignorePattern = '**/foo';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('path/to/foo')).toBe(true);
    expect(regExp.test('foo')).toBe(true);
    expect(regExp.test('bar/foo/baz')).toBe(true);
  });

  it('Test pattern: abc/**', () => {
    const gitignorePattern = 'abc/**';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('abc')).toBe(true);
    expect(regExp.test('abc/file.txt')).toBe(true);
    expect(regExp.test('abc/subfolder/file.txt')).toBe(true);
    expect(regExp.test('other/file.txt')).toBe(false);
  });

  it('Test pattern: a/**/b', () => {
    const gitignorePattern = 'a/**/b';
    const regExp = gitignorePatternToRegExp(gitignorePattern);

    expect(regExp.test('a/b')).toBe(true);
    expect(regExp.test('a/x/b')).toBe(true);
    expect(regExp.test('a/x/y/b')).toBe(true);
    expect(regExp.test('a/file.txt')).toBe(false);
    expect(regExp.test('a//b')).toBe(false);
    expect(regExp.test('ab')).toBe(false);
  });
});


// TODO: FIX parsing paterns with ! (negation)
