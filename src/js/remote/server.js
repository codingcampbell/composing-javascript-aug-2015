var crypto = require('crypto');
var fs = require('fs');

var sha1 = function(input) {
  var hash = crypto.createHash('sha1');
  hash.update(input);
  return hash.digest('hex');
};

var output = function(res, obj, code) {
  obj.code = code || 200;
  var content = JSON.stringify(obj);
  res.writeHead(obj.code, {
    'Cache-Control': 'no-cache',
    'Connection': 'close',
    'Content-Type': 'application/json',
    'Content-Length': content.length
  });
  res.end(content);
};

var pad = function(num, places) {
  var result = String(num);
  while (result.length < places) {
    result = '0' + result;
  }

  return result;
};

function Session(id, number) {
  this.id = id;
  this.number = number;
  this.pairId = null;
  this.pairAttempts = 0;
  this.streams = [];
}

Session.prototype.genPairId = function() {
  this.pairAttempts += 1;
  this.pairId = pad(this.number.toString(36), 2) + pad(Math.floor(Math.random() * 1679615).toString(36), 4);
  return this.pairId;
};

Session.prototype.broadcastEvent = function(event, data) {
  var id = String(Math.random()).slice(2);
  this.streams = this.streams.filter(function(stream) {
    if (!stream.alive) {
      return false;
    }

    stream.send(id, event, data);
    return true;
  });
};

Session.prototype.addEventStream = function(stream) {
  this.streams.push(stream);
  this.broadcastEvent('join', JSON.stringify({ listeners: this.streams.length }));
};

function EventStream(req, res) {
  this.req = req;
  this.res = res;
  this.alive = true;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Transfer-Encoding': 'identity'
  });

  res.write('retry: 5000\r\n');

  res.on('close', function() {
    this.alive = false;
  }.bind(this));
}

EventStream.prototype.send = function(id, event, data) {
  this.res.write('id: ' + id + '\r\n');
  this.res.write('event: ' + event + '\r\n');
  this.res.write('data: ' + data + '\r\n\r\n');
};

module.exports = function() {
  var sessions = {};
  var sessionsList = [];

  var createSession = function(req, res) {
    if (sessionsList.length > 1000) {
      return output(res, { id: null, message: 'Too many sessions' }, 503);
    }

    var id = sha1(req.rawHeaders.join('') + Date.now() + String(Math.random()));
    sessions[id] = new Session(id, sessionsList.length);
    sessionsList.push(sessions[id]);
    output(res, { id: id });
  };

  var pairSession = function(pairId, req, res) {
    var session = sessionsList[parseInt(pairId.slice(0, 2), 36)];
    if (!session || session.pairId !== pairId) {
      return output(res, { id: null, message: 'Invalid pair ID'}, 403);
    }

    session.pairId = null;
    fs.readFile('./web/remote.html', function(err, data) {
      if (err) {
        return output(res, { error: err }, 500);
      };

      var content = data.toString('utf8').replace(/{{sessionId}}/g, session.id);
      res.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/html',
        'Content-Length': content.length,
        'Connection': 'close'
      });
      res.end(content);
    });
  };

  var createPair = function(sessionId, req, res, next) {
    var session = sessions[sessionId];
    if (!session) {
      return next();
    }

    if (session.pairAttempts > 100) {
      return output(res, { id: null, message: 'Too many pair attempts' }, 503);
    }

    output(res, { pairId: session.genPairId() });
  };

  var streamSession = function(sessionId, req, res, next) {
    var session = sessions[sessionId];
    if (!session) {
      return next();
    }

    session.addEventStream(new EventStream(req, res));
  };

  var sessionEvent = function(sessionId, eventName, req, res, next) {
    var session = sessions[sessionId];
    if (!session) {
      return next();
    }

    var data = '';
    req.on('data', function(chunk) {
      data += chunk.toString('utf8');
    });

    req.on('end', function() {
      session.broadcastEvent(eventName, data);
      output(res, { listeners: session.streams.length });
    });

  };

  return function(req, res, next) {
    var matches;

    if (req.method === 'GET' || req.method === 'HEAD') {
      if (/^\/r\/create\/?$/.test(req.url)) {
        return createSession(req, res);
      }

      matches = req.url.match(/^\/r\/([a-z0-9]{6})\/?$/);
      if (matches) {
        return pairSession(matches[1], req, res);
      }

      matches = req.url.match(/^\/r\/pair\/([a-f0-9]+)\/?$/);
      if (matches) {
        return createPair(matches[1], req, res);
      }

      matches = req.url.match(/^\/r\/stream\/([a-f0-9]+)\/?$/);
      if (matches) {
        return streamSession(matches[1], req, res, next);
      }
    }

    if (req.method === 'POST') {
      matches = req.url.match(/^\/r\/event\/([a-f0-9]+)\/([0-9a-zA-Z_-]+)\/?$/);
      if (matches) {
        return sessionEvent(matches[1], matches[2], req, res, next);
      }
    }

    next();
  };
};
