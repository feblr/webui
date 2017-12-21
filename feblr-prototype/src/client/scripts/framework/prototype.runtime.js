var components = [];

var init = function () {
  components.forEach(function (component) {
    var instances = document.querySelectorAll(component.selector);
    for (var i = 0; i < instances.length; ++i) {
      var currNode = instances[i];

      var sources = {}
      if (component.sources) {
        for (var name in component.sources) {
          var config = component.sources[name];
          sources[name] = Rx.Observable.ajax(config);
        }
      }
      sources.props = Rx.Observable.from([]);

      if (component.methods.attached) {
        var sinks = component.methods.attached(currNode, sources);
        var subscriptions = Object.keys(sinks).map(function (sinkKey) {
          var sink = sinks[sinkKey];
          return sink.subscribe(function (data) {
            console.log('component sink: ', data);
          });
        });
      }
    }
  })
}

Rx.Observable
  .fromEvent(document, 'DOMContentLoaded')
  .map(init)
  .subscribe(function () {
    console.log('run');
  })
