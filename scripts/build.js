const fetch = require('node-fetch');
const path = require('path');
const {promisify} = require('util');
const glob = promisify(require('glob'));
const fs = require('fs');
const mkdirp = require('mkdirp');

/**
 * Format hosts as /etc/hosts style.
 * @param {string[]} hosts
 * @return {string[]} file
 */
function formatHostsfile(hosts) {
  return hosts.flatMap(host => [`:: ${host}`, `0.0.0.0 ${host}`]);
}

/**
 * @param {string[]} hosts
 * @return {string[]}
 */
function normalizeHosts(hosts) {
  const reformed = [];

  for (const host of hosts) {
    const no_scheme = host.replace(/^(?:https?)?:\/\//, "");
    const no_www = (() => {
      if (no_scheme.match(/^www\./)) {
        return no_scheme.match(/^www\.(.*)/)[1];
      } else {
        return no_scheme;
      }
    })();
    reformed.push(no_www);
    reformed.push('www.' + no_www);
  }

  const sorted = reformed.sort();
  const uniq = sorted.filter((e, i) => e !== sorted[i + 1]);
  return uniq;
}

/**
 * @param {string} filepath
 * @return {string[]} host names
 */
function loadFile(filepath) {
  return fs
    .readFileSync(filepath)
    .toString()
    .split('\n')
    .map(line => line.trim())
    .filter(line => !line.match(/^#/))
    .filter(line => !line.match(/^\s*$/));
}

/**
 * @param {string} category
 * @param {string} level
 * @return {string[]} host names
 */
function loadCategory(category, level) {
  const filename = `${category}-${level}.txt`;
  if (!fs.existsSync(filename)) {
    return [];
  }
  return loadFile(filename)
}

/**
  * @param {string} content
  * @return {string[]}
  */
function splitHosts(content) {
  const s = "0.0.0.0 "
  return content.split('\n').filter(e => e.startsWith(s)).map(e => e.slice(s.length));
}

async function main() {
  const profilePathList = await glob('*.profile')
  for (const profilePath of profilePathList) {
    let hostsBlockBase = [];
    const profileName = profilePath.split('.').slice(0, -1).join('.');
    const data = fs.readFileSync(profilePath).toString();
    const lines = data.split('\n')
    let free = '';
    for (const line of lines) {
      if (line.match(/^\s+#/)) continue;
      const lineTrim = line.trim();
      const [category, level] = lineTrim.split(/\s+/);
      if (category === 'get') {
        if (level.startsWith('file:')) {
          const rel = level.slice('file:'.length)
          const p = path.resolve(path.dirname(profilePath), rel)
          free += fs.readFileSync(p) + '\n';
        } else {
          const hostsContent = await fetch(level).then(r => r.text());
          hostsBlockBase = [
            ...hostsBlockBase,
            ...splitHosts(hostsContent),
          ];
        }
      } else {
        for (let lev = 0; lev <= level; lev++) {
          hostsBlockBase = [
            ...hostsBlockBase,
            ...loadCategory(category, lev),
          ];
        }
      }
    }
    const hostsBlock = normalizeHosts(hostsBlockBase);
    await mkdirp('build');
    const outPath = `build/${profileName}.hosts`;
    fs.writeFileSync(outPath, free + formatHostsfile(hostsBlock).join('\n') + '\n');
  }
}

main();
