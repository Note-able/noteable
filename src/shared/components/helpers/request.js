const validateStatus = (response) => {
  if (response.status < 200 || response.status > 399) {
    throw response.text();
  }

  return response.json == null ? null : response.json();
};

export const fetchJson = (url, { method, body }) => fetch(url, {
  headers: {
    'Content-type': 'application/json',
    accept: 'application/json',
    credentials: 'same-origin',
  },
  method: method || 'GET',
  body: JSON.stringify(body),
}).then(validateStatus);

const AJAX = {
  postBlob: (url, data, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.onload = function () {
      callback(this.response);
    };
    xhr.send(data);
  },
};

