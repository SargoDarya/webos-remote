'use strict';

import Reflux from 'reflux';

import Actions from '../actions/Actions.js';

//*************************************

const LGDevice = require('../../../lib/LGDevice');

const device = window.device = new LGDevice('ws://192.168.178.41:3000');

device.connect();

device.on('connected', function() {
  device.getChannelList(function(channelList) {
    Actions.channelListUpdate(channelList);
  });
  
  //device.getServices();
  
  device.subscribeVolume(function(volume) {
    //console.log(volume);
  });
  
  device.subscribeChannel(function(channel) {
    Actions.currentChannelUpdate(channel);
  });
  
  device.subscribeChannelCurrentProgramInfo(null, function(channelInfo) {
    Actions.currentProgramInfoUpdate(channelInfo);
  });
});

//*************************************

var directionalKeys = ['Up', 'Down', 'Left', 'Right'];
document.onkeydown = function(evt) {
  if (directionalKeys.indexOf(evt.keyIdentifier) > -1) {
    switch(evt.keyIdentifier) {
      case 'Up': break;
    }
  }
};

//*************************************

let _channels = {
  radio: [],
  tv: []
};

let _apps = [];

let _currentChannel = {};

let _searchFilter = '';

let _currentProgram = [];

function getApplicationState() {
  return {
    channels: _channels,
    apps: _apps,
    currentChannel: _currentChannel,
    searchFilter: _searchFilter,
    currentProgram: _currentProgram
  }
}

export default Reflux.createStore({
  listenables: Actions,
  getInitialState: function() {
    return getApplicationState();
  },
  
  onSetChannel: function(channelId) {
    device.setChannel(channelId, function() {
      this.trigger(getApplicationState());
    });
  },
  
  onChannelListUpdate: function(list) {
    let sortedChannels = list.payload.channelList.sort(function(a, b) {
      return Number(a.channelNumber) - Number(b.channelNumber);
    });
    
    _channels = {
      radio: sortedChannels.filter(channel => channel.Radio),
      tv: sortedChannels.filter(channel => channel.TV)
    };
    
    this.trigger(getApplicationState());
  },
  
  onAppListUpdate: function(list) {
    _apps = list;
    this.trigger(getApplicationState());
  },
  
  onProgramInfoUpdate: function(programInfo) {
    //_currentProgram = programInfo.payload.programList; //.filter(program => program.isPresent);
    this.trigger(getApplicationState());
  },
  
  onCurrentProgramInfoUpdate: function(programInfo) {
    _currentProgram = programInfo.payload;
    this.trigger(getApplicationState());
  },
  
  onCurrentChannelUpdate: function(channel) {
    _currentChannel = channel.payload;
    this.trigger(getApplicationState());
  },
  
  onSearchFilterUpdate: function(searchTerm) {
    _searchFilter = searchTerm;
    this.trigger(getApplicationState());
  }
});