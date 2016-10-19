import React from 'react';

class NavigationSidebar extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {
      showSidebar: false,
    };
  }
  
  openSidebar() {
    this.setState({
      showSidebar: !this.state.showSidebar,
    });
  }
  
  focusSearch(event) {
    event.target.placeholder = '';
  }
  
  blurSearch (event) {
    event.target.placeholder = 'Search';
  }
  
  render() {
    let activeTab = 'profile';
    switch(this.props.activeTab) {
      case '#documents':
        activeTab = 'documents';
        break;
      case '#messages':
        activeTab = 'messages';
        break;
      case '#events':
        activeTab = 'events';
        break;
      default:
        break;
    }

    return (
      <div className="navigation-sidebar">
        <div className="navigation-sidebar__content" style={this.state.showsidebar ? {'display' : 'initial'} : null}>
          <div className="navigation-sidebar__content__filter-bar-container">
            <input className="navigation-sidebar__content__filter-bar" onFocus={(event) => this.focusSearch(event)} onBlur={(event) => this.blurSearch(event)} placeholder="Search"/>
          </div>
          <div className="navigation-sidebar__content__options">
            <div className={`navigation-sidebar__content__options--option ${activeTab === 'profile' ? 'navigation-sidebar__content__options--option--active' : ''}`} onClick={() => this.props.navigate('profile')}>Profile</div>
            <div className={`navigation-sidebar__content__options--option ${activeTab === 'documents' ? 'navigation-sidebar__content__options--option--active' : ''}`} onClick={() => this.props.navigate('documents')}>Documents</div>
            {activeTab !== 'documents' ? null :
              <div className="navigation-sidebar__content__options--option__sub-options">
              </div>
            }
            <div className={`navigation-sidebar__content__options--option ${activeTab === 'messages' ? 'navigation-sidebar__content__options--option--active' : ''}`} onClick={() => this.props.navigate('messages')}>Messages</div>
            <div className={`navigation-sidebar__content__options--option ${activeTab === 'events' ? 'navigation-sidebar__content__options--option--active' : ''}`} onClick={() => this.props.navigate('events')}>Events</div>
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