'use strict';
var yeoman = require('yeoman-generator');
var formatUrl = require('normalize-url');
var base = require('path').basename;
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  // initializing: function () {
  //   this.composeWith('riot-tag:new');
  // },

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
      name: 'uEmail',
      message: 'What\'s your email address?',
      store: true,
      validate: function (val) {
        return /^(?:\w+\.?\+?)*\w+@(?:\w+\.)+\w+$/.test(val) ? true : 'invalid email provided';
      }
    }, {
      name: 'uWebsite',
      message: 'What\'s your website?',
      store: true,
      default: function (props) {
        return 'https://github.com/' + props.uGithub;
      }
    }, {
      type: 'confirm',
      name: 'useGit',
      message: 'Initialize a Git repository?',
      store: true,
      default: true
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
      name: 'usePublish',
      message: 'Publish to NPM and/or Bower?',
      default: true,
      store: true
    }, {
      type: 'confirm',
      name: 'useColors',
      message: 'Include Material Design color palette? (SASS)',
      default: true,
      store: true,
      when: function (res) {
        return res.useNPM || res.useBower;
      }
    }, {
      type: 'list',
      name: 'viaColors',
      message: 'Install the color palette via...',
      store: true,
      choices: ['Bower', 'NPM'],
      when: function (res) {
        return res.useColors && res.useNPM && res.useBower;
      }
    }, {
      name: 'tagName',
      message: 'What\'s the name of your Riot tag?',
      store: true,
      default: base(process.cwd()),
      validate: function (val) {
        return val.trim().length > 0 ? true : 'tag name is required';
      }
    }, {
      name: 'tagDesc',
      message: 'Please describe your tag\'s purpose.',
      store: true,
      default: function (props) {
        return props.tagName + ' does an awesome thing!';
      },
      validate: function (val) {
        return val.trim().length > 0 ? true : 'tag name is required';
      }
    }, {
      name: 'tagExtn',
      message: 'What should be the file extension?',
      store: true,
      default: '.tag',
      validate: function (val) {
        return val.trim().length > 0 ? true : 'extension is required';
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      this.props.hasBoth = props.useBower && props.useNPM;
      this.props.uWebsite = formatUrl(props.uWebsite);

      this.props.tagName = props.tagName.replace(' ', '-');
      this.props.tagExtn = props.tagExtn.replace('.', '');

      done();
    }.bind(this));
  },

  writing: function () {
    var self = this;
    var p = self.props;

    var statics = ['_editorconfig', '_gitignore'];

    if (p.useBower) {
      if (!p.hasBoth) {
        p.viaColors = 'Bower';
      }
      statics.push('-bower.json');
    }

    if (p.useNPM) {
      if (!p.hasBoth) {
        p.viaColors = 'NPM';
      }
      statics.push('-package.json');
    }

    // copy over all statics
    statics.forEach(function (src) {
      var dest = src.replace('_', '.').replace('-', '');
      self.template(src, dest, p);
    });

    // create the tag file
    var file = [p.tagName, p.tagExtn].join('.');
    var src = ['base-tag', p.tabType].join('.');
    self.template(src, file, p);

    // copy the styles file
    var sty = [p.tagName, 'sass'].join('.');
    self.template('tag-styles.sass', sty, p);
  },

  install: function () {
    var p = this.props;

    if (p.useBower) {
      this.bowerInstall();
    }

    if (p.useNPM) {
      this.npmInstall(['riot']); // no save
    }

    function getComm(isBower) {
      return isBower ? 'bowerInstall' : 'npmInstall';
    }

    // if using `md-colors` figure how to install it
    if (p.useColors) {
      var cmd = p.hasBoth ? getComm(p.viaColors === 'Bower') : getComm(p.useBower);
      this[cmd](['md-colors'], {save: true});
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
