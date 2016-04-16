const AJAX = {
  Get : function (url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status === 200) {
        callback(this.response);
      }
    }
    xhr.open(`GET`, url, true);
    xhr.send(null);
  },

  Post: function (url, data, callback){
    const xhr = new XMLHttpRequest();
    xhr.open(`POST`, url, true);
    xhr.setRequestHeader(`Content-type`, `application/json`);
    xhr.onload = function (){
      callback(this.response);
    }
    xhr.send(data);
  }
}

module.exports = AJAX;
