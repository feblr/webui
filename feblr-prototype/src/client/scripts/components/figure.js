(function (components) {
  var template = '<figure class="figure"><img/><figcaption></figcaption></figure>';
  var Figure = {
    name: 'Figure',
    selector: 'figure.figure',
    template: template,
    style: '.figure { margin: 0; padding: 0; } .figure img { width: 100%; } .figure figcaption { text-align: center; }',
    props: function () {
      return {
        imgSrc: '/images/iphone.png',
        caption: '默认图片标题',
      };
    },
    sources: {
      image: { method: 'GET', url: '/api/banners' }
    },
    methods: {
      create: function (props) {
        var divElem = document.createElement('div');
        divElem.innerHTML = template;
        var imgElem = divElem.querySelector('img');
        imgElem.setAttribute('src', props.imgSrc);
        var captionElem = divElem.querySelector('figcaption');
        captionElem.textContent = props.caption;

        return divElem.children[0];
      },
      attached: function (elem, sources) {
        var sinks = {};
        sinks.props = sources.image
          .map(function (res) {
            return res.response;
          })
          .merge(sources.props)
          .do(function (props) {
            elem.querySelector('img').setAttribute('src', props.imgSrc);
            elem.querySelector('figcaption').textContent = props.caption;
          });

        sinks.click = Rx.Observable
          .fromEvent(elem, 'click')
          .map(function (evt) {
            alert('click on figure')
          });

        return sinks;
      },
      detached: function (elem, sources) {
        console.log('detached will be called after the element is detached')
      },
      destroy: function (sources) {
        console.log('function destroy will be called after the element is destroy')
      }
    }
  };
  components.push(Figure);
})(components);