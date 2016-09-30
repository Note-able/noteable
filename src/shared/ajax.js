const AJAX = {
  get: (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status === 200) {
        callback(this.response);
      }
    };
    xhr.open('GET', url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.send(null);
  },

  post: (url, data, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('accept', 'application/json');
    xhr.onload = function () {
      callback(this.response, this);
    };
    xhr.send(data);
  },

  postBlob: (url, data, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.onload = function () {
      callback(this.response);
    };
    xhr.send(data);
  },

  postJSON: (url, data, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function () {
      callback(this.response);
    };
    xhr.send(JSON.stringify(data));
  },
};

module.exports = AJAX;
