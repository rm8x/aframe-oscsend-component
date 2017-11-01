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
  tick: function () {
    if (osc.status() !== OSC.STATUS.IS_OPEN) {
      return;
    }
    var el = this.el;

    var rotation = el.getAttribute('rotation');
    const rotationMessage = new OSC.Message([this.data.messagePath, 'rotation'], rotation.x, rotation.y, rotation.z);
    
    var position = el.getAttribute('position');
    const positionMessage = new OSC.Message([this.data.messagePath, 'position'], position.x, position.y, position.z);

    const bundle = new OSC.Bundle(rotationMessage, positionMessage);
    osc.send(bundle);
  },
});
