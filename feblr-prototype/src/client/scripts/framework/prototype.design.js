var components = [];
var instances = {};
var subjects = {};

var tellParent = function (msg) {
  var target = location.protocol + '//' + location.host;
  window.parent.postMessage(msg, target);
}

var pageProps = {
};

var configSubject = new Rx.Subject();
configSubject.subscribe({
  error: function (evt) {
    console.log(evt);
  },
  next: function (msg) {
    tellParent(msg);
  },
  complete: function () { },
});
configSubject.next({
  action: 'components:select',
  payload: {
    componentId: 0,
    props: pageProps
  }
});

var findComponent = function (name) {
  var component;
  for (var i = 0; i < components.length; i++) {
    if (components[i].name === name) {
      component = components[i]
    }
  }

  return component;
}

var appendComponent = function (component, parentElem) {
  if (component.style) {
    var styleElem = document.createElement('style');
    styleElem.innerText = component.style;
    document.head.appendChild(styleElem);
  }

  var props = component.props();
  var compElem = component.methods.create(props);
  var id = new Date().getTime();
  compElem.setAttribute('id', id);
  instances[id] = {
    props: props
  };

  var sources = {}
  if (component.sources) {
    for (var name in component.sources) {
      var config = component.sources[name];
      sources[name] = Rx.Observable.ajax(config);
    }
  }
  var subject = new Rx.Subject();
  subjects[id] = subject;
  sources.props = subject;

  parentElem.appendChild(compElem);
  if (component.methods.attached) {
    var sinks = component.methods.attached(compElem, sources);
    var subscriptions = Object.keys(sinks).map(function (sinkKey) {
      var sink = sinks[sinkKey];
      if (sinkKey === 'props') {
        return sink.subscribe(function (props) {
          instances[id].props = props;

          configSubject.next({
            action: 'components:update:props',
            payload: {
              componentId: id,
              props: props
            }
          })
        });
      } else {
        return sink.subscribe(function (data) {
          console.log('component sink: ', data);
        });
      }
    });
  }

  return compElem;
}

var closestComponent = function (elem, kls) {
  if (elem === document.body) {
    return elem;
  }

  var parentElem = null;
  do {
    parentElem = elem.parentElement;
    if (parentElem.classList.contains(kls)) {
      break;
    }
  } while (parentElem === document.body);

  return parentElem;
}

var setup = function () {
  var isDroppable = function (evt) {
    return true || evt.target.dataset.droppable || evt.target === document.body;
  }

  Rx.Observable
    .fromEvent(document.body, 'click')
    .map(function (evt) {
      if (evt.target === document.body) {
        configSubject.next({
          action: 'components:select',
          payload: {
            componentId: 0,
            props: pageProps
          }
        });
      } else {
        var compElem = closestComponent(evt.target, '.mgm-component');
        if (compElem) {
          var componentId = compElem.getAttribute('id');
          configSubject.next({
            action: 'components:select',
            payload: {
              componentId: componentId,
              props: instances[componentId].props
            }
          });
        } else {
          configSubject.next({
            action: 'components:select',
            payload: {
              componentId: 0,
              props: pageProps
            }
          });
        }
      }
    })
    .subscribe(function () {
    })

  Rx.Observable
    .fromEvent(document, 'dragenter')
    .filter(isDroppable)
    .do(function (evt) {
      evt.target.classList.add('active');
    })
    .subscribe({
      error: function (evt) {
        console.log(evt);
      },
      next: function () {
        console.log('dragenter');
      }
    });

  Rx.Observable
    .fromEvent(document, 'dragover')
    .filter(isDroppable)
    .do(function (evt) {
      evt.preventDefault();
    })
    .subscribe(function () {
      console.log('dragover');
    });

  Rx.Observable
    .fromEvent(document, 'dragleave')
    .filter(isDroppable)
    .do(function (evt) {
      evt.target.classList.remove('active');
    })
    .subscribe(function () {
      console.log('dragleave');
    });

  Rx.Observable
    .fromEvent(document, 'drop')
    .filter(isDroppable)
    .do(function (evt) {
      evt.preventDefault();
      evt.target.classList.remove('active');

      var name = evt.dataTransfer.getData('text');
      var component = findComponent(name);

      var compElem = appendComponent(component, evt.target);
      compElem.classList.add('mgm-component');
    })
    .subscribe(function () {
      console.log('drop');
    });
}

var registerComponents = function (evt) {
  var payload = components.map(function (component) {
    return {
      name: component.name
    };
  });

  tellParent({
    action: 'components:register',
    payload: payload
  });
}

Rx.Observable
  .fromEvent(document, 'DOMContentLoaded')
  .do(registerComponents)
  .do(setup)
  .subscribe(function () {
    console.log('loaded');
  });

Rx.Observable
  .fromEvent(window, 'message')
  .filter(function (evt) {
    return evt.data != '';
  })
  .map(function (evt) {
    var data = evt.data;
    switch (data.action) {
      case 'config:update':
        var subject = subjects[data.payload.componentId];
        subject.next(data.payload.props);
        break;
      default:
        console.log('unhandled message: ', data);
        break;
    }
  })
  .subscribe(function () {
    console.log('components');
  });