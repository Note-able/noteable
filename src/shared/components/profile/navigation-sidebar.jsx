import React, { Component, PropTypes } from 'react';

class NavigationSidebar extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
    navigate: PropTypes.func.isRequired,
  }

  focusSearch(event) {
    event.target.placeholder = '';
  }
  
  blurSearch (event) {
    event.target.placeholder = 'Search';
  }
  
  render() {
    const activeTab = this.props.activeTab.length === 0 ? 'profile' : this.props.activeTab;

    return (
      <div className="navigation-sidebar">
        <div className="navigation-sidebar__content">
          <div className="navigation-sidebar__content__filter-bar-container">
            <input className="navigation-sidebar__content__filter-bar" onFocus={(event) => this.focusSearch(event)} onBlur={(event) => this.blurSearch(event)} placeholder="Search" />
          </div>
          <div className="navigation-sidebar__content__options">
            <div className={`navigation-sidebar__content__options--option ${activeTab.indexOf('profile') !== -1 || activeTab.length === 0 ? 'active-tab' : ''}`} onClick={(event) => { event.stopPropagation(); this.props.navigate('profile'); }}>
              <div>Profile</div>
              {activeTab.indexOf('profile') === -1 && activeTab.length !== 0 ? null :
                <div className="navigation-sidebar__content__options--option__suboptions">
                  <div className={`navigation-sidebar__content__options--option__suboptions--option ${activeTab.indexOf('settings') !== -1 ? 'active-tab' : ''}`} onClick={(event) => { event.stopPropagation(); this.props.navigate('profilesettings'); }}>Settings</div>
                </div>
              }
            </div>
            <div className={`navigation-sidebar__content__options--option ${activeTab === 'documents' ? 'active-tab' : ''}`} onClick={() => this.props.navigate('documents')}>Documents</div>
            {activeTab !== 'documents' ? null :
              <div className="navigation-sidebar__content__options--option__sub-options">
              </div>
            }
            <div className={`navigation-sidebar__content__options--option ${activeTab === 'messages' ? 'active-tab' : ''}`} onClick={() => this.props.navigate('messages')}>Messages</div>
            <div className={`navigation-sidebar__content__options--option ${activeTab === 'events' ? 'active-tab' : ''}`} onClick={() => this.props.navigate('events')}>Events</div>
            {activeTab !== 'events' ? null :
              <div className="navigation-sidebar__content__options--option__sub-options">
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = NavigationSidebar;