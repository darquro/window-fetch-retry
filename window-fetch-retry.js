import 'whatwg-fetch';

// fetch URL
let _url = '';

// fetch options
let _options = {};

// retry delay milliseconds
let _retryDelay = 0;

// timeout for total retry
let _timeout = 0;

// whether timeout occurred
let _isTimeout = false;

// whether fetch succeeded
let _isResolve = false;

// retry fetch task ID
let _retryFetchTaskId = null;

/**
 * fetch wrapper
 *
 * @param  {String} url     URL
 * @param  {Object} options extended fetch option
 * @return {Promise}        fetch result
 *
 * # usage
 *
 * import fetch from 'js/utils/FetchRetry';
 *
 * fetch(url, {
 *   retries: 3,        // retry count
 *   retryDelay: 1000,  // retry delay milliseconds
 *   timeout: 3000,     // timeout for total retry
 * })
 * .then((response) => {
 * })
 */
function wrappedFetch(url, options) {
  _url = url;
  _options = options;
  const retries = options && options.retries ? options.retries : 0;
  _retryDelay = options && options.retryDelay ? options.retryDelay : 0;
  _timeout = options && options.timeout ? options.timeout : 0;

  // delete extended options not in fetch
  delete _options.retries;
  delete _options.retryDelay;
  delete _options.timeout;

  return new Promise((resolve, reject) => {
    setTimeoutAllProcesses(reject);
    retryFetch(retries, resolve);
  });
}

/**
 * set task for time out total retrying
 * @param {Promise.reject} reject reject
 */
function setTimeoutAllProcesses(reject) {
  let timeoutId;
  if (_timeout > 0) {
    timeoutId = setTimeout(() => {
      if (_isResolve) {
        clearTimeout(timeoutId);
        return;
      }
      _isTimeout = true;
      if (_retryFetchTaskId) clearTimeout(_retryFetchTaskId);
      reject(new Error('fetch timeout'));
    }, _timeout);
  }
}

/**
 * retry fetch
 * @param  {Number} retries retry count
 * @param  {Promise.resolve} resolve resolve
 * @return {Promise}         Promise
 */
function retryFetch(retries, resolve) {
  fetch(_url, _options)
    .then((res) => {
      if (!res.ok && retries > 0 && !_isTimeout) {
        _retryFetchTaskId = setTimeout(() => {
          retryFetch(retries - 1, resolve);
        }, _retryDelay);
        return;
      }
      _isResolve = true;
      resolve(res);
    });
}

export default wrappedFetch;
