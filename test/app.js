'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var assign = require('object-assign');

var app = path.join(__dirname, '../generators/app');

var defs = {
  uName: 'asd',
  uEmail: 'asd@asd.com',
  uWebsite: 'http://asd.com',
  uGithub: 'asd',
  tabType: 'tab',
  tabWidth: '2',
  tagName: 'hello-world',
  tagDesc: 'hello world tag',
  tagExtn: '.tag',
  useGit: false,
  useNPM: false,
  useBower: false,
  usePublish: false,
  useColors: false
};

var expect = ['.editorconfig', '.gitignore', 'hello-world.tag'];

describe('with bower only, no colors', function () {
  before(function (done) {
    var opts = assign({}, defs, {useBower: true});
    helpers.run(app).withPrompts(opts).on('end', done);
  });

  it('creates all files: ', function () {
    assert.file(expect);
  });

  it('creates `bower.json`: ', function () {
    assert.file('bower.json');
  });

  it('does not create `package.json`', function () {
    assert.noFile('package.json');
  });
});

describe('with bower only, with colors', function () {
  before(function (done) {
    var opts = assign({}, defs, {
      useBower: true,
      useColors: true
    });
    helpers.run(app).withPrompts(opts).on('end', done);
  });

  it('creates all files: ', function () {
    assert.file(expect);
  });

  it('creates `bower.json`: ', function () {
    assert.file('bower.json');
  });

  it('does not create `package.json`', function () {
    assert.noFile('package.json');
  });
});

describe('with npm only, no colors', function () {
  before(function (done) {
    var opts = assign({}, defs, {useNPM: true});
    helpers.run(app).withPrompts(opts).on('end', done);
  });

  it('creates all files: ', function () {
    assert.file(expect);
  });

  it('creates `package.json`: ', function () {
    assert.file('package.json');
  });

  it('does not create `bower.json`', function () {
    assert.noFile('bower.json');
  });
});

describe('with npm only, with colors', function () {
  before(function (done) {
    var opts = assign({}, defs, {
      useNPM: true,
      useColors: true
    });
    helpers.run(app).withPrompts(opts).on('end', done);
  });

  it('creates all files: ', function () {
    assert.file(expect);
  });

  it('creates `package.json`: ', function () {
    assert.file('package.json');
  });

  it('does not create `bower.json`', function () {
    assert.noFile('bower.json');
  });
});

describe('with npm and bower, no colors', function () {
  before(function (done) {
    var opts = assign({}, defs, {
      useNPM: true,
      useBower: true
    });
    helpers.run(app).withPrompts(opts).on('end', done);
  });

  it('creates all files: ', function () {
    assert.file(expect);
  });

  it('creates `package.json`: ', function () {
    assert.file('package.json');
  });

  it('creates `bower.json`', function () {
    assert.file('bower.json');
  });
});

describe('with npm and bower, no colors', function () {
  before(function (done) {
    helpers.run(app).withPrompts(
      assign({}, defs, {
        useNPM: true,
        useBower: true
      })
    ).on('end', done);
  });

  it('creates all files: ', function () {
    assert.file(expect);
  });

  it('creates `package.json`: ', function () {
    assert.file('package.json');
  });

  it('creates `bower.json`', function () {
    assert.file('bower.json');
  });
});

describe('with npm and bower, with colors', function () {
  before(function (done) {
    helpers.run(app).withPrompts(
      assign({}, defs, {
        useNPM: true,
        useBower: true,
        useColors: true,
        viaColors: 'Bower'
      })
    ).on('end', done);
  });

  it('creates all files: ', function () {
    assert.file(expect);
  });

  it('creates `package.json`: ', function () {
    assert.file('package.json');
  });

  it('creates `bower.json`', function () {
    assert.file('bower.json');
  });
});
