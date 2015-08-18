var _ajax = function (method, url, callback, data) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    callback(this.responseText);
  };

  xhr.onerror = function() {
    console.error('Ajax error', xhr);
  };

  xhr.open(method, url, true);
  xhr.send(data);
};

export default {
  get: function(url, callback) {
    return _ajax('get', url, callback);
  },

  post: function(url, data, callback) {
    return _ajax('post', url, callback, data);
  }
};
