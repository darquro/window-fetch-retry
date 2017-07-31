import 'whatwg-fetch';

let _url = '';
let _options = {};
let _retryDelay = 0;
let _timeout = 0;

let _isTimeout = false;
let _isResolve = false;
let _retryTask = null;

function setTimeoutAllProcesses(reject) {
  let timeoutId;
  if (_timeout > 0) {
    timeoutId = setTimeout(() => {
      if (_isResolve) {
        clearTimeout(timeoutId);
        return;
      }
      _isTimeout = true;
      if (_retryTask) clearTimeout(_retryTask);
      reject(new Error('fetch timeout'));
    }, _timeout);
  }
}

function retringFetch(retries, resolve) {
  fetch(_url, _options)
    .then((res) => {
      if (!res.ok && retries > 0 && !_isTimeout) {
        _retryTask = setTimeout(() => {
          retringFetch(retries - 1, resolve);
        }, _retryDelay);
        return;
      }
      _isResolve = true;
      resolve(res);
    });
}

function wrappedFetch(url, options) {
  _url = url;
  _options = options;
  const retries = options && options.retries ? options.retries : 0;
  _retryDelay = options && options.retryDelay ? options.retryDelay : 0;
  _timeout = options && options.timeout ? options.timeout : 0;

  delete _options.retries;
  delete _options.retryDelay;
  delete _options.timeout;

  return new Promise((resolve, reject) => {
    setTimeoutAllProcesses(reject);
    retringFetch(retries, resolve);
  });
}

export default wrappedFetch;
