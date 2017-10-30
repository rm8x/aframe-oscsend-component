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
	    messagePath: {default: '/'},
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: true,

	  /**
	   * Initialize OSC event listeners.
	   */
	  initOscListeners: function () {
	    // osc.on('/response', (message) => {
	    //   console.log('response from test', message.args)
	    // });
	    
	  osc.on('open', () => {
	      console.log('osc connection open');
	      // const message = new OSC.Message('/test', 'hello');
	      // osc.send(message);
	    });
	    
	    osc.on('close', () => {
	      console.log('osc connection closed');
	    });
	    
	    osc.on('error', (err) => {
	      console.log('osc error', err);
	    });
	  },

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function () {
	    var plugin = new OSC.WebsocketClientPlugin({host: this.data.serverURL, port: this.data.serverPort });
	    osc = new OSC({ plugin: plugin });
	    this.initOscListeners();
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
	  //TODO: reuse message object instead of creating new instance
	  //TODO: do not use JSON.stringify()
	  tick: function () {
	    if (osc.status() !== OSC.STATUS.IS_OPEN) {
	      return;
	    }
	    var el = this.el;
	    var rotation = el.getAttribute('rotation');
	    var position = el.getAttribute('position');
	    //console.log('rotation: ', rotation, " position: ", position);
	    
	    const message = new OSC.Message(this.data.messagePath, JSON.stringify(rotation), JSON.stringify(position));
	    //console.log('msg: ', message);
	    osc.send(message);
	  }
	});


/***/ })
/******/ ]);