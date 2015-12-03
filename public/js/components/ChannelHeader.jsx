import React from 'react';

import ProgressBar from './ProgressBar.jsx'

function pad(s) {
  return ('00'+s).substr(-2);
}

function getTime(start, end) {
  if (start && end) {
    return pad(start.getHours()) + ':' + pad(start.getMinutes()) + ' - ' + pad(end.getHours()) + ':' + pad(end.getMinutes());
  } else {
    return '';
  }
}

export default React.createClass({
  render: function() {
    var currentChannel = this.props.currentChannel;
    var channelName = currentChannel.channelName;
    var channelNumber = currentChannel.channelNumber;
    
    var currentProgram = this.props.currentProgram;
    if (currentProgram.startTime) {
      var startTimeArray = currentProgram.localStartTime.split(',');
      var endTimeArray = currentProgram.localEndTime.split(',');
      startTimeArray[1] -= 1;
      endTimeArray[1] -= 1; 
      
      var startTime = new Date(...startTimeArray);
      var endTime = new Date(...endTimeArray); 
    }

    return <div className='channel-header'>
      <div className="channel-header__number">{channelNumber}</div>
      <div className="channel-header__info">
        <div className="channel-header__name">{channelName}</div>
        <div className="channel-header__program">
          <span className="channel-header__program-duration">{getTime(startTime, endTime)}</span>
          <span className="channel-header__program-name">{currentProgram.programName}</span>
        </div>
      </div>
      <ProgressBar startTime={startTime} endTime={endTime} />
    </div>;
  }
});