
import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import Actions from '../actions/Actions';

import Channel from './Channel.jsx';

export default React.createClass({
  handleFilterChange: function() {
    Actions.searchFilterUpdate(this.refs.filterTextInput.value);
  },

  render: function() {
    return <div className="channel-list">
      <h1>Channel List</h1>
      <input 
        type="search" 
        value={this.props.searchFilter} 
        ref="filterTextInput" 
        onChange={this.handleFilterChange}
        placeholder="Search Channel..."
        className="channel-list__search" />
      <Tabs>
        <TabList>
          <Tab>TV</Tab>
          <Tab>Radio</Tab>
        </TabList>
        
        <TabPanel>
          <ul className='channel-list__list'>
            {this.props.channels.tv
              .filter(channel => {
                return channel.channelName.indexOf(this.props.searchFilter) > -1;
              })
              .map(channel => {
                return <Channel channel={channel} key={channel.channelId} />
              })
            }
          </ul>
        </TabPanel>
        
        <TabPanel>
          <ul className='channel-list__list'>
            {this.props.channels.radio.map(function(channel) {
              return <Channel channel={channel} key={channel.channelId} />
            })}
          </ul>
        </TabPanel>
      </Tabs>
    </div>
  }
})