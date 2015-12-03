import React from 'react';

function pad(s) {
  return ('00'+s).substr(-2);
}

function getTime(start, end) {
  return pad(start.getHours()) + ':' + pad(start.getMinutes()) + ' - ' + pad(end.getHours()) + ':' + pad(end.getMinutes());
}

export default React.createClass({
  render: function() {
    var programs = this.props.programList;
    
    return <ul className='program-list'>
      {
        programs.map(program => {
          var startTime = new Date(...program.localStartTime.split(','));
          var endTime = new Date(...program.localEndTime.split(','));
          
          return <li className='program-list__program' key={program.programId}>
            <div className='program-list__time'>{getTime(startTime, endTime)}</div>
            <div className='program-list__name'>{program.programName}</div>
            <div className='program-list__short-description'>{program.description}</div>
          </li>
        })
      }
    </ul>
  }
});