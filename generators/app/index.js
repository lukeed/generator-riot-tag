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
      validate: function(val) {
        return val.trim().length > 0 ? true : 'name is required';
      }
    }, {
      name: 'uGithub',
      message: 'What\'s your GitHub username?',
      store: true,
      validate: function(val) {
        return val.trim().length > 0 ? true : 'github username is required';
      }
    }, {
      name: 'uWebsite',
      message: 'What\'s your website?',
      store: true,
      default: function(props) {
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
      name: 'useColors',
      message: 'Include Material Design color palette? (SASS)',
      default: true,
      store: true
    }, {
      type: 'confirm',
      name: 'useBower',
      message: 'Publish to the Bower registry?',
      default: true,
      store: true
    }, {
      name: 'tagName',
      message: 'What\'s the name of your Riot tag?',
      store: true,
      default: base(process.cwd()),
      validate: function(val) {
        return val.trim().length > 0 ? true : 'tag name is required';
      }
    }, {
      type: 'confirm',
      name: 'gitinit',
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
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
