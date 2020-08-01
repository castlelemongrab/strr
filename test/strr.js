
'use strict';

const chai = require('chai');
const Strr = require('../src/strr');
const promises = require('chai-as-promised');

/**
 * @name str:
 *   Unit tests for the Strr utilities library.
 */
describe('str', () => {

  let should = chai.should();
  chai.use(promises);

  it('parses single items', () => {
    Strr.split_delimited('')
      .should.deep.equal([ ]);
    Strr.split_delimited(' ')
      .should.deep.equal([ '' ]);
    Strr.split_delimited(' foo ')
      .should.deep.equal([ 'foo' ]);
    Strr.split_delimited(' \\f\\o\\o ')
      .should.deep.equal([ 'foo' ]);
  });

  it('parses simple pairs', () => {
    Strr.split_delimited('= ')
      .should.deep.equal([ '', '' ]);
    Strr.split_delimited(' = ')
      .should.deep.equal([ '', '' ]);
    Strr.split_delimited('=\\=\\\\')
      .should.deep.equal([ '', '=\\' ]);
    Strr.split_delimited('foo=')
      .should.deep.equal([ 'foo', '' ]);
    Strr.split_delimited('foo\\=bar')
      .should.deep.equal([ 'foo=bar' ]);
    Strr.split_delimited('foo\\bar=')
      .should.deep.equal([ 'foobar', '' ]);
    Strr.split_delimited('foo=bar')
      .should.deep.equal([ 'foo', 'bar' ]);
    Strr.split_delimited('foo = bar')
      .should.deep.equal([ 'foo', 'bar' ]);
    Strr.split_delimited('foo\\ =\\ bar')
      .should.deep.equal([ 'foo', 'bar' ]);
    Strr.split_delimited('foo\\==\\=bar')
      .should.deep.equal([ 'foo=', '=bar' ]);
    Strr.split_delimited('foo\\===\\=bar')
      .should.deep.equal([ 'foo=', '', '=bar' ]);
    Strr.split_delimited('foo\\====\\=bar')
      .should.deep.equal([ 'foo=', '', '', '=bar' ]);
    Strr.split_delimited('foo\\\\')
      .should.deep.equal([ 'foo\\' ]);
    Strr.split_delimited('foo\\\\=bar\\')
      .should.deep.equal([ 'foo\\', 'bar' ]);
    Strr.split_delimited('\\\\\\==\\=\\\\')
      .should.deep.equal([ '\\=', '=\\' ]);
  });

  it('parses tuples', () => {
    Strr.split_delimited('foo=bar=baz\\')
      .should.deep.equal([ 'foo', 'bar', 'baz' ]);
    Strr.split_delimited('foo \\ =bar \\ =\\ba\\z\\')
      .should.deep.equal([ 'foo', 'bar', 'baz' ]);
  });

  it('obeys strict mode', () => {
    (() => Strr.split_delimited('\\', '=', '\\', true))
      .should.throw(Error);
    (() => Strr.split_delimited('\\\\\\', '=', '\\', true))
      .should.throw(Error);
    Strr.split_delimited('  \\\\', '=', '\\', true)
      .should.deep.equal([ '\\' ]);
  });

  it('respects limits', () => {
    Strr.split_delimited('foo = base64=', null, null, null, 2)
      .should.deep.equal([ 'foo', 'base64=' ]);
    Strr.split_delimited('foo = base64=\\', null, null, true, 2)
      .should.deep.equal([ 'foo', 'base64=\\' ]);
  });

});

