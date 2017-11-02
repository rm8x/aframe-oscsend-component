/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	var OSC = window.OSC;
	var osc = '';

	/* global AFRAME */
	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * OSCtest component for A-Frame.
	 */
	AFRAME.registerComponent('oscsend', {
	  schema: {
	    serverURL: {default: 'localhost'},
	    serverPort: {default: 8080},
	    messagePath: {default: ''},
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: true,

	  /**
	   * Initialize OSC event listeners.
	   */
	  initOscListeners: function () {
	    osc.on('open', () => {
	      console.log('osc connection open');
	    });
	    
	    osc.on('close', () => {
	      console.log('osc connection closed');
	    });
	    
	    osc.on('error', (err) => {
	      console.log('osc error', err);
	    });
	  },

	  messages: {
	    positionMessage: new OSC.Message(['{replaceme}', 'position']),
	    rotationMessage: new OSC.Message(['{replaceme}', 'rotation']),
	  },

	  initReusedMessages: function () {
	    for(v in this.messages) {
	      this.messages[v].address = this.messages[v].address.replace('{replaceme}', this.data.messagePath || '');
	      this.messages[v].types = 'fff';
	      this.messages[v].args.push(0, 0, 0);
	    }
	  },

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function () {
	    this.initReusedMessages = AFRAME.utils.bind(this.initReusedMessages, this);
	    this.updateMessageArgs = AFRAME.utils.bind(this.updateMessageArgs, this);

	    var plugin = new OSC.WebsocketClientPlugin({host: this.data.serverURL, port: this.data.serverPort });
	    osc = new OSC({ plugin: plugin });

	    this.initOscListeners();
	    this.initReusedMessages();
	    osc.open();    
	   },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {
	   },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function () {
	    osc.close();
	   },

	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   */
	  pause: function () { },

	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   */
	  play: function () { },
	 
	  //TODO: investigate AFRAME.utils.throttleTick for use here
	  tick: function () {
	    if (osc.status() !== OSC.STATUS.IS_OPEN) {
	      return;
	    }
	    var el = this.el;
	    this.updateMessageArgs(this.messages.rotationMessage, el.getAttribute('rotation'));
	    this.updateMessageArgs(this.messages.positionMessage, el.getAttribute('position'));
	    osc.send(this.messages.rotationMessage);
	    osc.send(this.messages.positionMessage);
	  },

	  updateMessageArgs: function(message, xyzElAttribute) {
	    message.args[0] = xyzElAttribute.x;
	    message.args[1] = xyzElAttribute.y;
	    message.args[2] = xyzElAttribute.z;
	  }
	});


/***/ })
/******/ ]);