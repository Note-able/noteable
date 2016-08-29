import React from 'react';

class NewsfeedSidebar extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {
      showDrawer: false,
      filter: 'Near Me',
    };
    
    this.filters = {
      near: 'Near Me',
      members: 'Members',
      events: 'Events',
    };
  }
  
  openDrawer() {
    this.setState({
      showDrawer: !this.state.showDrawer,
    });
  }
  
  focusSearch(event) {
    event.target.placeholder = '';
  }
  
  blurSearch (event) {
    event.target.placeholder = 'Search';
  }
  
  renderContentlist() {
    if (this.state.filter === this.filters.near) {
      return(
        <div className="near-me-feed">
          {this.props.nearMe == null ?
            <div className="near-me-feed--is-empty">Nothing new near you right now!</div> :
            this.props.nearMe.map((event) => (
              <div className="near-me-feed__item" key={event.id}>
                {event.title}
              </div>
            ))
          }
        </div>
      );
    } else if (this.state.filter === this.filters.members) {
      return(
        <div className="near-me-feed">
          {this.props.nearMe == null ?
            <div className="near-me-feed--is-empty">Nothing new near you right now!</div> :
            this.props.nearMe.map((event) => (
              <div className="near-me-feed__item" key={event.id}>
                {event.title}
              </div>
            ))
          }
        </div>
      );
    } else if (this.state.filter === this.filters.events) {
      return(
        <div className="near-me-feed">
          {this.props.nearMe == null ?
            <div className="near-me-feed--is-empty">Nothing new near you right now!</div> :
            this.props.nearMe.map((event) => (
              <div className="near-me-feed__item" key={event.id}>
                {event.title}
              </div>
            ))
          }
        </div>
      );
    } else {
      return null;
    }
  }
  
  render() {
    return (
      <div className="navigation-drawer">
        <div className={`navigation-drawer__pullout ${!this.state.showDrawer ? 'navigation-drawer__pullout--is-open' : ''}`} onClick={() => this.openDrawer} />
        <div className="navigation-drawer__content" style={this.state.showDrawer ? {'display' : 'initial'} : null}>
          <div className="navigation-drawer__content__filter-bar-container">
            <input className="navigation-drawer__content__filter-bar" onFocus={(event) => this.focusSearch(event)} onBlur={(event) => this.blurSearch(event)} placeholder="Search"/>
          </div>
          <div className="navigation-drawer__content__options">
            <div onClick={() => this.setFilter(this.filters.near)} className="navigation-drawer__content__options--nearby">Noteable News</div>
            <div onClick={() => this.setFilter(this.filters.events)} className="navigation-drawer__content__options--events">Notifications <span className="notifications-count">{this.state.notificationsCount}</span></div>
          </div>
          <div className="navigation-drawer__content__list">
            {this.renderContentlist()}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = NewsfeedSidebar;