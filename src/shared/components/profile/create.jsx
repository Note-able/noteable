import React, { Component, PropTypes } from 'react';
import instruments from './instruments.json';

module.exports = class ProfileCreate extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      preferences: PropTypes.shape({
        instruments: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    savePreferences: PropTypes.func.isRequired,
    updateInstruments: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.savePreferences(this.props.profile.id);
  }

  toggleInput(instrument) {
    this.props.updateInstruments(instrument);
  }

  render() {
    const instrumentList = instruments.instruments;
    const instrumentKeys = Object.keys(instrumentList);
    const stuff = this.props.profile.preferences.instruments;
    return (
      <div className="app-container">
        <div className="navbar">
          <a href="/"><div className="home-button">Noteable</div></a>
        </div>
        <div className="edit-profile-container">
          <h1 className="edit-profile-container__header">Hey {this.props.name}, tell us a little bit about yourself</h1>
          <div className="edit-profile-container__field__instruments--header">What instruments do you play?</div>
          <div className="edit-profile-container__field__instruments--submit-button" onClick={() => this.props.savePreferences()}>Next</div>
          <ul className="edit-profile-container__field__instruments">
            {instrumentKeys.map(key => {
              const instrument = instrumentList[key];

              return (
                <li className="edit-profile-container__field__instruments--instrument" key={instrument} onClick={() => this.toggleInput(instrument)}>
                  <input
                    className="edit-profile-container__field__instruments--instrument--checkbox"
                    type="checkbox"
                    name={instrument}
                    checked={stuff.indexOf(instrument) !== -1 ? instrument : null}
                  />
                  <label htmlFor={instrument}>{instrument}</label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
};
