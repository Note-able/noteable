const validateStatus = (response) => {
  if (response.status < 200 || response.status > 399) {
    throw response.text();
  }

  return response;
}

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

  postOld: (url, data, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('accept', 'application/json');
    xhr.onload = function () {
      callback(this.response, this);
    };
    xhr.send(data);
  },

  postNoBody: (url) => {
    return window.fetch(url, {
      headers: {
        'Content-type': 'application/json',
        'accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      method: 'POST',
    })
    .then(validateStatus);
  },

  post: (url, data) => {
    return window.fetch(url, {
      headers: {
        'Content-type': 'application/json',
        'accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'credentials': 'same-origin',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(validateStatus)
    .then(response => {
      if (response.status === 204) {
        return;
      }

      return response.json()
    });
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
