# window-fetch-retry

Adds retry functionality to the Fetch API.

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
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
```
