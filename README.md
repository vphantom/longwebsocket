# longwebsocket v1.0.0-beta

Reconnecting wrapper around native WebSocket

While browsers' native WebSocket object simply stops functioning when the connection is lost, this module takes care of reviving the connection and keeping handlers active.  It also makes sure to randomize progressively longer delays up to 30 seconds between retries to avoid flooding a server as it comes back online.

## Installation & Usage

### Client-side, stand-alone using Bower

```sh
bower install longwebsocket --save
```

You can then integrate `bowe_components/longwebsocket/longwebsocket.min.js` to your build as needed.  (The non-minified version is a CommonJS module, not suitable for direct browser use.)  This was generated using `browserify --standalone` and is thus safe as-is or with various module systems.  Stand-alone example:

```html
<script src="longwebsocket.min.js"></script>
...
<script type="text/javascript"><!--
  var ws = new LongWebSocket();
  ...
// --></script>
```

### Node.JS and client-side (CommonJS)

```sh
npm install longwebsocket --save
```

In Node.JS or if you're using Browserify to bundle CommonJS modules together for client-side use, you can choose whichever name you'd like, although in this document we'll assume `LongWebSocket`.  For example:

```js
var LongWebSocket = require('longwebsocket');
var ws = new LongWebSocket();
...
```

### Usage example

```js
var ws = new LongWebSocket({
  onmessage: function(msg) {
    console.log('Received: ' + msg);
    ws.send(msg);  // Simple echo
  },
  onopen: function() {
    console.log("There we go, we're online now, we can send!");
  },
  onclose: function() {
    console.log("Offline! Not for long, I'm sure...");
  }
});
```

## API

### ws = new LongWebSocket([*options*])

If supplied, the `options` is an object which may include any combination of:

**url:** If omitted, a WebSocket will be attempted at the current location's host and port.  HTTPS will also correctly yield a WSS socket.

**protocols:** Passed directly to WebSocket.

**onmessage:** Callback for you to receive messages as they arrive.  It will be given a single argument containing the message itself.

**onopen:** Called each time the WebSocket becomes available for sending, if specified.

**onclose:** Called each time the WebSocket gets closed (including by you).

All arguments are optional, but only a specific set of combinations are allowed: a single argument must be `onmsg`.  If there are more than one argument, there may be up to 2 strings left of `onmsg` which will be processed as either `(protocols)` or `(url, protocols)` according to count.  To the right of `onmsg` the immediate next is considered `onopen`, then `onclose`.

### ws.send(msg)

Send message `msg` to the other end.  Any error would bubble up from the underlying WebSocket.

### ws.close([*code*[, *reason*]])

Close the WebSocket and do not attempt to reconnect it.  Arguments are passed directly to WebSocket.

### ws.open()

Re-open a closed LongWebSocket.  Previously defined options are retained.
