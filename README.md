## One Liners

```
(() => { const allow = ["www.google.ru", "www.youtube.com", "b.hatena.ne.jp", "www.amazon.co.jp", "www.amazon.com", "amazon.co.jp", "amazon.com", "www.google.com", "play.google.com", "google.com", "twitter.com", "apps.apple.com", "accounts.google.com", "w.atwiki.jp", "support.google.com", "maps.google.com", "www.google.co.jp", "google.co.jp", "policies.google.com", "togetter.com", "webcache.googleusercontent.com", "translate.google.com"]; const a = [...($0||document.body).querySelectorAll('a')] .filter(el => el.href?.match(/^(?:https?:)?\/\//)) .map(el => el.href.match(/^(?:https?:)?\/\/([^\/]*)/)[1]) .sort(); const b = a.filter((e, i) => a.indexOf(e) === i).filter(e => !allow.includes(e)); console.log(b.join('\n')); })();
```

```
(() => {
  const allow = ["www.amazon.co.jp", "www.amazon.com", "amazon.co.jp", "amazon.com", "www.google.com", "play.google.com", "google.com", "twitter.com", "apps.apple.com", "accounts.google.com", "w.atwiki.jp", "support.google.com", "maps.google.com", "www.google.co.jp", "google.co.jp", "policies.google.com", "togetter.com", "webcache.googleusercontent.com", "translate.google.com"];
  const a = [...($0||document.body).querySelectorAll('a')]
    .filter(el => el.href?.match(/^(?:https?:)?\/\//))
    .map(el => el.href.match(/^(?:https?:)?\/\/([^\/]*)/)[1])
    .sort();
  const b = a.filter((e, i) => a.indexOf(e) === i).filter(e => !allow.includes(e));
  console.log(b.join('\n'));
})();
```


facebook全言語のホスト名

```
(() => {
  const allow = ["www.amazon.co.jp", "www.amazon.com", "amazon.co.jp", "amazon.com", "www.google.com", "play.google.com", "google.com", "twitter.com", "apps.apple.com", "accounts.google.com", "w.atwiki.jp", "support.google.com", "maps.google.com", "www.google.co.jp", "google.co.jp", "policies.google.com", "togetter.com", "webcache.googleusercontent.com", "translate.google.com"];
  const a = [...($0||document.body).querySelectorAll('a')]
    .filter(el => el.onclick?.toString().match(/setCookieLocale\(".*",/))
    .map(el => el.onclick.toString().match(/setCookieLocale\("([^"]*)",/)[1])
    .map(el => el + ".facebook.com")
    .sort();
  const b = a.filter((e, i) => a.indexOf(e) === i).filter(e => !allow.includes(e));
  console.log(b.join('\n'));
})();
```
