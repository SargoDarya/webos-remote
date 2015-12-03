'use strict';

const EventEmitter = require('events').EventEmitter;
const HandshakePayload = require('./Handshake');

class LGDevice extends EventEmitter {
  constructor(host) {
    super();
    
    this.host = host;
    this.commandCount = 0;
    
    this.handshaken = false;
    
    this.socketClient = null;
  }
  
  connect() {
    this.socketClient = new WebSocket('ws://' + location.host);
    
    this.socketClient.addEventListener('open', this.onConnectHandler.bind(this));
    this.socketClient.addEventListener('error', this.onErrorHandler.bind(this));
    this.socketClient.addEventListener('close', this.onCloseHandler.bind(this));
  }
  
  disconnect() {
    this.socketClient.close();
  }
  
  handshake() {
    this.command('register', 'register', null, HandshakePayload.getKey());
  }
  
  command(prefix, msgType, uri, payload, callback) {
    var socketMessage = {
      id: prefix + this.commandCount++,
      type: msgType
    };
    
    if (uri) {
      socketMessage.uri = uri;
    }
    
    if (payload) {
      socketMessage.payload = payload;
    }
    
    if (typeof callback === 'function') {
      if (msgType === 'subscribe') {
        this.on(socketMessage.id, callback);
      } else {
        this.once(socketMessage.id, callback);
      }
    }
    
    this.socketClient.send(JSON.stringify(socketMessage));
    
    return socketMessage.id;
  }
  
  /*****************************
   * COMMANDS
   *****************************/
  
  showFloat(floatText, callback) {
    this.command('', 'request', 'ssap://system.notifications/createToast', { 'message': floatText }, callback)
  }
  
  turnOff(callback) {
    this.command('', 'request', 'ssap://system/turnOff', null, callback);
  }
  
  getChannelList(callback) {
    this.command('channels', 'request', 'ssap://tv/getChannelList', null, callback);
  }
  
  getChannel(callback) {
    this.command('channel', 'request', 'ssap://tv/getCurrentChannel', null);
  }
  
  getChannelProgramInfo(callback) {
    this.command('channelProgramInfo', 'request', 'ssap://tv/getChannelProgramInfo', null, callback);
  }
  
  getChannelCurrentProgramInfo(channelId, callback) {
    var params = {};
    
    if (channelId) {
      params.channelId = channelId;
    }
    
    this.command('channelCurrentProgramInfo', 'request', 'ssap://tv/getChannelCurrentProgramInfo', params, callback);
  }
  
  setChannel(channelId) {
    this.command('channel', 'request', 'ssap://tv/openChannel', { channelId: channelId });
  }

  getInputList() {
    this.command('inputList', 'request', 'ssap://tv/getExternalInputList', null);
  }

  setInput(inputId) {
    this.command('', 'request', 'ssap://tv/switchInput', { inputId: inputId });
  }
  
  setMute(mute) {
    this.command('', 'request', 'ssap://audio/setMute', { mute: mute });
  }
  
  getAppList() {
    this.command('', 'request', 'ssap://com.webos.applicationManager/listApps', null);
  }
  
  getServices() {
    this.command('', 'request', 'ssap://api/getServiceList', null, function(services) {
      console.log(services);
    });
  }

  set3d(toggle, callback) {
    if (toggle) {
      this.command("", "request", "ssap://com.webos.service.tv.display/set3DOn", null, callback);
    } else {
      this.command("", "request", "ssap://com.webos.service.tv.display/set3DOff", null, callback);
    }
  }

  /*****************************
   * Keys
   *****************************/
  
  inputChannelUp(callback) {
    this.command("", "request", "ssap://tv/channelUp", null, callback);
  }
  
  inputChannelDown(callback) {
    this.command("", "request", "ssap://tv/channelDown", null, callback);
  }
  
  inputVolumeUp(callback) {
    this.command("", "request", "ssap://audio/volumeUp", null, callback);
  }
  
  inputVolumeDown(callback) {
    this.command("", "request", "ssap://audio/volumeDown", null, callback);
  }
  
  inputBackspace(count, callback) {
    var c = count === undefined ? 1 : count;
    this.command("", "request", "ssap://com.webos.service.ime/deleteCharacters", {"count": c}, callback);
  };
  
  /*****************************
   * Subscriptions
   *****************************/
  
  subscribeChannel(callback) {
    this.command('channel', 'subscribe', 'ssap://tv/getCurrentChannel', null, callback);
  }
  
  subscribeVolume(callback) {
    this.command('volume', 'subscribe', 'ssap://audio/getVolume', null, callback);
  }
  
  subscribeChannelProgramInfo(callback) {
    this.command('channelProgramInfo', 'subscribe', 'ssap://tv/getChannelProgramInfo', null, callback);
  }
  
  subscribeChannelCurrentProgramInfo(channelId, callback) {
    var params = {};
    
    if (channelId) {
      params.channelId = channelId;
    }
    
    this.command('channelCurrentProgramInfo', 'subscribe', 'ssap://tv/getChannelCurrentProgramInfo', params, callback);
  }
  
  /*****************************
   * Handlers
   *****************************/
  onConnectHandler() {
    
    this.socketClient.addEventListener('message', (message) => {
      var json = JSON.parse(message.data);
      this.emit(json.id, json);
      this.emit(json.type, json);
    });
    
    this.once('registered', (clientKey) => {
      console.log('connected');
      HandshakePayload.setKey(clientKey);
      this.emit('connected');
    });

    console.log('connected...');
    
    this.handshake();
  }
  
  onCloseHandler(close) {
    this.emit('connectionError');
    console.log(close);
  }
  
  onErrorHandler(err) {
    this.emit('connectionError');
    console.log(err);
  }
}

module.exports = LGDevice;