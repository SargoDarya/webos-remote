'use strict';

const React = require('react');
const Reflux = require('reflux');

import ApplicationStore from './stores/ApplicationStore.js';

import ChannelHeader from './components/ChannelHeader.jsx';
import ChannelList from './components/ChannelList.jsx';
import ProgramList from './components/ProgramList.jsx';

var Remote = React.createClass({
  mixins: [Reflux.connect(ApplicationStore)],
  render: function() {
    return <div>
      <ChannelHeader currentChannel={this.state.currentChannel} currentProgram={this.state.currentProgram} />
      <ChannelList channels={this.state.channels} searchFilter={this.state.searchFilter} />
    </div>;
  }
});

React.render(<Remote />, document.getElementById('remote'));
