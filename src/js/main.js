import Events from './events';
import Slides from 'slides';
import ajax from 'ajax';
import examples from 'examples';

// Syntax highlighting
[].forEach.call(document.querySelectorAll('code'), function(element) {
  if (!element.classList.contains('inline')) {
    window.hljs.highlightBlock(element);
  }
});

var eventBus = new Events();
var slides = new Slides(eventBus);

window.addEventListener('keydown', e => {
  if (e.which === 37 || e.which === 38) {
    eventBus.trigger('prev');
  }

  if (e.which === 39 || e.which === 40) {
    eventBus.trigger('next');
  }
});

eventBus.on('slideActive', function(slideIndex) {
  location.hash = slideIndex;
  sendNotes();
});

var sessionId, evtSource, listeners = 0;

var postEvent = function(event, data) {
  if (!sessionId) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = function() {};
  xhr.open('post', '/r/event/' + sessionId + '/' + event, true);
  if (data) {
    xhr.setRequestHeader('Content-Type', 'application/json');
  }
  xhr.send(data && JSON.stringify({ notes: data }) || '');
};

var sendNotes = function() {
  if (listeners <= 1) {
    return;
  }

  var notes = document.querySelector('.slide.active aside');
  postEvent('notes', notes !== null && notes.innerHTML || '');
};

var updateHash = function() {
  var matches = location.hash.match(/^#(\d+)/);
  if (!matches) {
    return;
  }

  var slideIndex = +matches[1];
  if (slideIndex !== slides.slideIndex) {
    eventBus.trigger('moveToSlide', +matches[1]);
  }
};

window.addEventListener('hashchange', updateHash);
updateHash();

var init = function() {
  var evtSource = new EventSource('/r/stream/' + sessionId);
  evtSource.addEventListener('prev', function() {
    eventBus.trigger('prev');
  });

  evtSource.addEventListener('next', function() {
    eventBus.trigger('next');
  });

  evtSource.addEventListener('join', function(e) {
    var json;
    sendNotes();

    try {
      var json = JSON.parse(e.data);
      listeners = json.listeners;
    } catch (e) {}
  });
};

ajax.get('/r/create', function(data) {
  var obj = JSON.parse(data);
  sessionId = obj.id;

  ajax.get('/r/pair/' + sessionId, function(data) {
    obj = JSON.parse(data);
    console.log('pairId', obj.pairId);
    init();
  });
});

if (document.body.classList.contains('dark')) {
  document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="assets/highlight/obsidian.css">';
}
