module.exports = {
  "name": "webpack-ng1-express-mpa",
  "description": "基于点融官网使用的技术架构，浏览器使用angular1.x，Node使用框架为Express",
  "prompt": [
    {
      "type": "input",
      "name": "name",
      "message": "输入项目名称"
    },
    {
      "type": "input",
      "name": "description",
      "message": "输入项目介绍"
    },
    {
      "type": "input",
      "name": "git",
      "message": "输入项目git仓库地址"
    },
    {
      "type": "input",
      "name": "domain",
      "message": "输入项目域名",
      "default": "localhost"
    },
    {
      "type": "input",
      "name": "viewsDir",
      "message": "输入页面编译输出路径",
      "default": "views"
    },
    {
      "type": "input",
      "name": "distDir",
      "message": "输入静态资源编译输出路径",
      "default": "dist"
    }
  ],
  "render": {
    "ignore": [
      /.+.jade/g
    ]
  }
};
