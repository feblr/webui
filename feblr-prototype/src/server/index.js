const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const liveServer = require('live-server');

const params = {
  port: 8181,
  root: path.join(__dirname, '../client'),
  open: false,
  file: 'index.html',
  ignore: '../client/temporary/demo.html',
  mount: [['/vendors', path.join(__dirname, '../../node_modules')]],
  middleware: [function (req, res, next) {
    if (req.originalUrl === '/api/banners') {
      setTimeout(function () {
        var content = {
          imgSrc: '/images/test.jpg',
          caption: '测试图片标题'
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(content));
        res.end();
      }, 2000);
    } else if (req.originalUrl === '/api/pages') {
      var chunks = [];
      req.on('data', function (chunk) {
        chunks.push(chunk);
      });

      req.on("end", function () {
        var body = Buffer.concat(chunks);
        var data = JSON.parse(body);
        var $ = cheerio.load(data.view);

        $('script[src="/scripts/framework/prototype.design.js"]').attr('src', "/scripts/framework/prototype.runtime.js")
        $('link[href="/styles/framework.design.css"]').attr('href', "/styles/framework.runtime.css");
        $('script:not([src])').remove();

        var demo = path.join(__dirname, '../client/temporary/demo.html');
        var html = '<!DOCTYPE html>' + $.html();

        fs.writeFile(demo, html, function (err) {
          if (!err) {
            res.statusCode = 201;
            res.write("{}");
            res.end();
          } else {
            res.end("{}");
            res.end();
          }
        });
      });
    } else {
      next();
    }
  }]
};

liveServer.start(params);
