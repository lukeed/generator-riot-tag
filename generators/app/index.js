'use strict';
var yeoman = require('yeoman-generator');
var formatUrl = require('normalize-url');
var base = require('path').basename;
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-riot-tag') + ' generator!'
    ));

    var prompts = [{
      name: 'uName',
      message: 'What\'s your name?',
      store: true,
      validate: function (val) {
        return val.trim().length > 0 ? true : 'name is required';
      }
    }, {
      name: 'uGithub',
      message: 'What\'s your GitHub username?',
      store: true,
      validate: function (val) {
        return val.trim().length > 0 ? true : 'github username is required';
      }
    }, {
      name: 'uWebsite',
      message: 'What\'s your website?',
      store: true,
      default: function (props) {
        return 'https://github.com/' + props.uGithub;
      }
    }, {
      type: 'list',
      name: 'tabType',
      message: 'Do you use tabs or spaces?',
      choices: ['tab', 'space'],
      store: true
    }, {
      type: 'list',
      name: 'tabWidth',
      message: 'How about spacing width?',
      choices: ['2', '4'],
      store: true
    }, {
      type: 'confirm',
      name: 'useBower',
      message: 'Use Bower? (`bower.json`)',
      default: true,
      store: true
    }, {
      type: 'confirm',
      name: 'useNPM',
      message: 'Use NPM? (`package.json`)',
      default: true,
      store: true
    }, {
      type: 'confirm',
      name: 'useColors',
      message: 'Include Material Design color palette? (SASS)',
      default: true,
      store: true
    }, {
      name: 'tagName',
      message: 'What\'s the name of your Riot tag?',
      store: true,
      default: base(process.cwd()),
      validate: function (val) {
        return val.trim().length > 0 ? true : 'tag name is required';
      }
    }, {
      type: 'confirm',
      name: 'useGit',
      message: 'Initialize a Git repository?',
      store: true,
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      this.props.uWebsite = formatUrl(props.uWebsite);
      this.props.tagName = props.tagName.replace(' ', '-');

      done();
    }.bind(this));
  },

  writing: function () {
    var self = this;

    var statics = ['_editorconfig', '_gitignore'];

    if (self.props.useBower) {
      statics.push('-bower.json');
    }

    if (self.props.useNPM) {
      statics.push('-package.json');
    }

    statics.forEach(function (src) {
      var dest = src.replace('_', '.').replace('-', '');
      self.template(src, dest, self.props);
    });
  },

  install: function () {
    if (this.props.useBower) {
      this.bowerInstall();
    }

    if (this.props.useNPM) {
      this.npmInstall();
    }
  },

  end: function () {
    var self = this;

    if (!self.props.useGit) {
      return;
    }

    console.log('\n');
    self.spawnCommand('git', ['init']).on('close', function () {
      self.spawnCommand('git', ['add', '--all']).on('close', function () {
        self.spawnCommand('git', ['commit', '-m', 'first commit, via generator-riot-tag']).on('close', function () {
          console.log('\n');
          self.async();
        });
      });
    });
  }
});
