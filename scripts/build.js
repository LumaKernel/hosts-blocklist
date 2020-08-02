const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const fs = require('fs');
const mkdirp = require('mkdirp');

/**
 * Format hosts as /etc/hosts style.
 * @param {string[]} hosts
 * @return {string[]} file
 */
function formatHostsfile(hosts) {
  return hosts.map(host => `0.0.0.0 ${host}`);
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
  const uniq = sorted.filter((e, i) => sorted.indexOf(e) === i);
  return uniq;
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
  return fs
    .readFileSync(filename)
    .toString()
    .split('\n')
    .map(line => line.trim())
    .filter(line => !line.match(/^#/))
    .filter(line => !line.match(/^\s*$/));
}

async function main() {
  const profilePathList = await glob('*.profile')
  for (const profilePath of profilePathList) {
    let hostsBlockBase = [];
    const profileName = profilePath.split('.').slice(0, -1).join('.');
    const data = fs.readFileSync(profilePath).toString();
    const lines = data.split('\n')
    for (const line of lines) {
      if (line.match(/^\s+#/)) continue;
      const lineTrim = line.trim();
      const [category, level] = lineTrim.split(/\s+/);
      for (let lev = 0; lev <= level; lev++) {
        hostsBlockBase = [
          ...hostsBlockBase,
          ...loadCategory(category, lev),
        ];
      }
    }
    const hostsBlock = normalizeHosts(hostsBlockBase)
    await mkdirp('build');
    const outPath = `build/${profileName}.hosts`;
    fs.writeFileSync(outPath, formatHostsfile(hostsBlock).join('\n') + '\n');
  }
}

main();
