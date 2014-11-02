/*
 * crchash
 * https://github.com/DavidAnson/grunt-check-pages
 *
 * Copyright (c) 2014 David Anson
 * Licensed under the MIT license.
 */

'use strict';

// Imports
var stream = require('stream');
var util = require('util');
var crc = require('crc');
var Transform = stream.Transform;

// Crc32Hash class

util.inherits(Crc32Hash, Transform);

// Constructor
function Crc32Hash(options) {
  if (!(this instanceof Crc32Hash)) {
    return new Crc32Hash(options);
  }
  Transform.call(this, options);
  this.value = 0;
}

// Transform function implementations
/* eslint-disable no-underscore-dangle */
Crc32Hash.prototype._transform = function(chunk, encoding, callback) {
  this.value = crc.crc32(chunk, this.value);
  callback();
};
Crc32Hash.prototype._flush = function(callback) {
  var buffer = new Buffer(4);
  buffer.writeUInt32BE(this.value, 0);
  this.push(buffer);
  callback();
};
/* eslint-enable no-underscore-dangle */

/**
 * Creates and returns an object to compute CRC hash digests.
 *
 * @param {string} algorithm CRC algorithm (supported values: crc32).
 * @return {Stream.Transform} Duplex stream like Crypto.Hash (unsupported methods: update, digest).
 */
module.exports.createHash = function(algorithm) {
  if (algorithm === 'crc32') {
    return new Crc32Hash();
  }
  throw new Error('Unsupported algorithm.');
};