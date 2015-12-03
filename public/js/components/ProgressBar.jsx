import React from 'react';

export default React.createClass({
  componentDidMount: function() {
    setInterval(this.forceUpdate.bind(this), 5000);
  },
  
  render: function() {
    var currentTime = new Date();
    var total = +this.props.endTime - +this.props.startTime;
    var filled = (+currentTime) - (+this.props.startTime);
    
    var progressBarStyle = {
      width: filled/total*100 + '%'
    };
    
    return <div className="progress-bar">
      <div className="progress" style={progressBarStyle}></div>
    </div>
  }
});