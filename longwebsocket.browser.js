(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LongWebSocket = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! longwebsocket v1.0.1-beta
 * <https://github.com/vphantom/longwebsocket>
 * Copyright 2016 Stéphane Lavergne
 * Free software under MIT License: <https://opensource.org/licenses/MIT> */

'use strict';

module.exports = function(options) {
  var reconnect = true;
  var tries = 0;
  var ws = null;
  var url = null;
  var protocols = null;
  var onmessage = null;
  var onopen = null;
  var onclose = null;

  if (typeof window === 'undefined') {
    return;
  }

  if (typeof options === 'object') {
    url       = options.url;
    protocols = options.protocols;
    onmessage = options.onmessage;
    onopen    = options.onopen;
    onclose   = options.onclose;
  }

  if (typeof url !== 'string') {
    url = 'ws'
      + (window.location.protocol === 'https:' ? 's' : '')
      + '://'
      + window.location.host
    ;
  }

  /**
   * Open actual WebSocket
   *
   * @return {undefined} No return value
   */
  function openSocket() {
    reconnect = true;
    ws = new WebSocket(url, protocols);
    ws.onclose = function() {
      if (typeof onclose === 'function') {
        onclose();
      }
      if (reconnect) {
        // Back off progressively
        tries++;
        setTimeout(openSocket,
          Math.random()
          * Math.min(30, (Math.pow(2, tries) - 1))
          * 1000
        );
      }
    };
    ws.onopen = function() {
      tries = 0;
      if (typeof onopen === 'function') {
        onopen();
      }
    };
    ws.onmessage = function(ev) {
      if (typeof onmessage === 'function') {
        onmessage(ev.data);
      }
    };
  }
  this.open = openSocket;
  openSocket();

  this.close = function(code, reason) {
    reconnect = false;
    return ws.close(code, reason);
  };

  this.send = function(msg) {
    return ws.send(msg);
  };
};

},{}]},{},[1])(1)
});