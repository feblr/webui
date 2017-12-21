module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    // this is the entry file for all our tests.
    files: [
      './index.js'
    ],
    // we will pass the entry file to webpack for bundling.
    preprocessors: {
      './index.js': ['webpack', 'sourcemap'],
      '../src/**/*': ['webpack']
    },
    webpack: {
      devtool: '#inline-source-map',
      module: {
        loaders: [
          {
            test: /\.vue$/,
            loader: 'vue'
          },
          {
            test: /\.js$/,
            loader: 'babel',
            // make sure to exclude 3rd party code in node_modules
            exclude: /node_modules/
          }
        ],
        postLoaders: [
          {
            test: /\.js$/,
            exclude: /test|node_modules|vue\/dist|lib\//,
            loader: 'istanbul-instrumenter'
          }
        ]
      },
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.common.js'
        }
      },
      vue: {
        loaders: {
          js: 'babel!eslint'
        }
      }
    },
    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: true
      }
    },
    client: {
      chai: {
        includeStack: true
      }
    },
    colors: true,
    autoWatch: true,
    autoWatchInterval: 300,
    singleRun: true,
    coverageReporter: {
      reporters: [
        { type: 'text-summary', dir: './coverage', subdir: '.' }
      ]
    }
  })
}