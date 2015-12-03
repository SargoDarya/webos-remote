import React from 'react';

import Actions from '../actions/Actions';

export default React.createClass({
  selectChannel: function() {
    Actions.setChannel(this.props.channel.channelId);
  },

  render: function() {
    var channel = this.props.channel;
    
    return <li className='channel' onClick={this.selectChannel}>
      <span className='channel__number'>{channel.channelNumber}</span>
      <span className='channel__name'>{channel.channelName}</span>
    </li>
  }
})