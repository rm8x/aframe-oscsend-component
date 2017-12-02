var OSC = window.OSC;
//var osc = '';

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
    useWss: {default: false},
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
    this.osc.on('open', () => {
      console.log('osc connection open');
    });
    
    this.osc.on('close', () => {
      console.log('osc connection closed');
    });
    
    this.osc.on('error', (err) => {
      console.log('osc error', err);
    });
  },

  messages: {
    positionMessage: new OSC.Message(['{replaceme}', 'position']),
    rotationMessage: new OSC.Message(['{replaceme}', 'rotation']),
  },

  initReusedMessages: function () {
    for(var v in this.messages) {
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
    this.initOscListeners = AFRAME.utils.bind(this.initOscListeners, this);
    //osc = new OSC(); // defaults to WebsocketClientPlugin

    // const plugin = new OSC.WebsocketBrowserPlugin({ port: 9001 })
    // const osc = new OSC({ plugin: plugin })

    this.initOscListeners();
    this.initReusedMessages();
    this.osc.open({host: this.data.serverURL, port: this.data.serverPort });    
   },

   osc: new OSC({ plugin: new OSC.WebsocketBrowserPlugin({secure: true}) }),
   
   //osc: new OSC({ plugin: new OSC.WebsocketBrowserPlugin({ port: 9001 }) }),
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
    if (this.osc.status() !== OSC.STATUS.IS_OPEN) {
      return;
    }
    var el = this.el;
    this.updateMessageArgs(this.messages.rotationMessage, el.getAttribute('rotation'));
    this.updateMessageArgs(this.messages.positionMessage, el.getAttribute('position'));
    this.osc.send(this.messages.rotationMessage);
    this.osc.send(this.messages.positionMessage);
  },

  updateMessageArgs: function(message, xyzElAttribute) {
    message.args[0] = xyzElAttribute.x;
    message.args[1] = xyzElAttribute.y;
    message.args[2] = xyzElAttribute.z;
  }
});
