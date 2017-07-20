# window-fetch-retry

Adds retry functionality to [window.fetch polyfill (whatwg-fetch)](https://github.com/github/fetch).

- [x] Retry count
- [x] Retry delay
- [x] Timeout (total of retries)

## Requirements

ECMAScript 2015

## Installation

```
$ npm install window-fetch-retry --save
```

## Usage

```js
import fetch from 'window-fetch-retry';
```

```js
fetch('/users.json', {
    retries: 3,
    retryDelay: 1000,
    timeout: 3000,
  })
  .then(res => res.json())
  .then((json) => {
    console.log('parsed json', json);
  }).catch((ex) => {
    console.log('parsing failed', ex);
  });
```
