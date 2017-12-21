var tellIframe = function (iframe, msg) {
  var target = location.protocol + '//' + location.host;
  iframe.contentWindow.postMessage(msg, target);
}

var registerComponents = function (components) {
  var componentsElem = document.getElementById('components');
  components.forEach(function (component) {
    var componentElem = document.createElement('div');
    componentElem.classList.add('component');
    componentElem.setAttribute('draggable', 'true');
    componentElem.textContent = component.name;
    componentElem.dataset['component'] = component.name;

    componentsElem.appendChild(componentElem);
  });
}

var config$ = new Rx.Subject();
var select$ = new Rx.Subject();

var currComponentId;
var updateConfig = function (config) {
  if (currComponentId === config.componentId) {
    return;
  }

  var propertiesElem = document.getElementById('properties');

  propertiesElem.innerHTML = '';

  var tableElem = document.createElement('table');
  var trElems = [];
  for(var key in config.props) {
    var prop = config.props[key];
    var elem = '<tr><td>' + key + '</td><td><input type="text" data-key="' + key + '" value="' + prop + '"/></td></tr>';

    trElems.push(elem);
  }
  tableElem.innerHTML = trElems.join('');

  propertiesElem.appendChild(tableElem);
}

select$.subscribe({
  error: function (err) { console.log(err); },
  next: updateConfig,
  complete: function (val) { console.log(vale); }
});

var handle = function (evt) {
  var data = evt.data;
  switch (data.action) {
    case 'components:register':
      registerComponents(data.payload);
    break;
    case 'components:select':
      select$.next(data.payload);
    break;
    case 'components:update:props':
      select$.next(data.payload);
    break;
  }
}

var save = function () {
  var preview = document.getElementById('preview');
  var doctype = preview.contentWindow.document.doctype;
  var html = preview.contentWindow.document.documentElement.innerHTML
  var view = '<html>' + html + '</html>';

  var request = {
    method: 'POST',
    url: '/api/pages',
    body: JSON.stringify({
      view: view
    })
  };

  return Rx.Observable
    .ajax(request)
}

var init = function () {
  var components = [];
  var componentsElem = document.getElementById('components');
  var propertiesElem = document.getElementById('properties');

  Rx.Observable
    .fromEvent(window, 'message')
    .filter(function (evt) {
      return evt.data != '';
    })
    .map(handle)
    .subscribe(function () {
      console.log('components');
    });

  Rx.Observable
    .fromEvent(componentsElem, 'dragstart')
    .map(function (evt) {
      evt.dataTransfer.setData('text/plain', evt.target.dataset.component);
    })
    .subscribe(function () {
      console.log('dragstart');
    });

  Rx.Observable
    .fromEvent(propertiesElem, 'input')
    .map(function (evt) {
      return {
        key: evt.target.dataset.key,
        val: evt.target.value
      };
    })
    .withLatestFrom(select$)
    .map(function (result) {
      var change = result[0];
      var config = result[1];
      config.props[change.key] = change.val;

      return config;
    })
    .subscribe(function (config) {
      var iframeElem = document.getElementById('preview');
      tellIframe(iframeElem, {
        action: 'config:update',
        payload: config
      });
    })

  Rx.Observable
    .fromEvent(document.getElementById('save-btn'), 'click')
    .map(save)
    .concatAll()
    .map(function () {
      var backdrop = document.getElementById('result-dialog');
      backdrop.classList.add('open');
    })
    .subscribe(function () {
      console.log('save');
    });

  Rx.Observable
    .fromEvent(document.getElementById('close-btn'), 'click')
    .map(function () {
      var backdrop = document.getElementById('result-dialog');
      backdrop.classList.remove('open');
    })
    .subscribe(function () {
      console.log('save');
    });
}

Rx.Observable
  .fromEvent(document, 'DOMContentLoaded')
  .map(init)
  .do(function () {
    var iframeElem = document.getElementById('preview');
    iframeElem.src = "/preview.html";
  })
  .subscribe(function () {
    console.log('running');
  });