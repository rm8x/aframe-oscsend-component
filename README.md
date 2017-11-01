## aframe-oscsend-component

[![Version](http://img.shields.io/npm/v/aframe-oscsend-component.svg?style=flat-square)](https://npmjs.org/package/aframe-oscsend-component)
[![License](http://img.shields.io/npm/l/aframe-oscsend-component.svg?style=flat-square)](https://npmjs.org/package/aframe-oscsend-component)

Sends OSC messages over a websocket connection.

For [A-Frame](https://aframe.io).
Using [osc-js](https://github.com/adzialocha/osc-js/wiki/PureData-&-MaxMSP).

### API

| Property    | Description                         | Default Value |
| ----------- | ----------------------------------- | ------------- |
| serverURL   | Path to a websocket server          | localhost     |
| serverPort  | Port of websocket server            | 8080          |
| messagePath | Send OSC messages with this address | ''            |

### Installation and Usage

In order to send messages over UDP you need to connect via WebSocket to a bridge server that will
forward forward the messages it recieves. Follow this example using [osc-js](https://github.com/adzialocha/osc-js/wiki/PureData-&-MaxMSP). 

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-oscsend-component/dist/aframe-oscsend-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity geometry="box" position="0 1 -2"
        oscsend="
        serverURL: localhost;
        serverPort: 8080;
        messagePath: /aframe;
        ">
      <a-animation attribute="rotation"
        dur="05000"
        direction="alternate-reverse"        
        fill="forwards"
        to="0 360 0"
        repeat="indefinite">
      </a-animation>
      <a-animation attribute="position"
        dur="10000"
        direction="alternate-reverse"
        to="0 3 -3"
        repeat="indefinite">
      </a-animation>
    </a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-oscsend-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-oscsend-component
```

Then require and use.

```js
require('aframe');
require('aframe-oscsend-component');
```
### TODO
* Allow users to specify which attributes to send
* Send attributes in a sensibly structured message
* Reconnect behavior
* Care deeply about performance (see TODOs on tick function)
* Demos