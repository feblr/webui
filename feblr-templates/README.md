feblr-templates是一个模板仓库，提供多种资源的生成模板，借助feblr-dr-cli可以生成多种资源。

# 如何编写一个新资源模板

1. 确定目标资源，并完成一个示例。（这里一个普通的npm模块为例）

    ```
    $ mkdir demo

    $ cd demo

    $ echo "console.log('hello, world');" > test.js

    $ node test.js

    hello, world
    ```

2. 确定模板定制项，编写模板元数据文件（这里假设可以test.js中输出的内容）

    ```
    $ touch feblr-meta.js

    $ cat feblr-meta.js

    module.exports = {
      "name": "",
      "description": "angular1 component template",
      "prompt": [
        {
          "type": "input",
          "name": "name",
          "message": "input your name"
        }
      ]
    };
    ```

    通过数组prompt来提供定制选项（基于Inquirer）

3. 修改模板内容。在模板模板文件中，可以通过prompt.key来获得用户输入的内容，

    ```
    $ echo test.js
    console.log("hello, {{prompt.name}}");
    ```
