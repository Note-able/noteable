import React from 'react';
import AJAX from '../../ajax';

import styles from './styles.less';

export default class Songs extends React.Component {
  constructor(props, context) {
    super(props, context);

    const songData = [{ title: 'song1', dateCreated: 'Just Now' }, { title: 'song2', dateCreated: 'January 1st, 2016' }];
    this.state = { songData };
  }

  componentDidMount() {
    AJAX.Get('songs/user', (response) => this.loadSongs(JSON.parse(response)));
  }

  loadSongs(songJson) {
    const newSongData = songJson.map((song) => {
      return { title: song.title, dateCreated: song.date };
    });
    this.setState({ songData: newSongData });
  }

  render() {
    return (
      <div>
        <div className={styles.buttonContainer}>
          <form action="/editor">
            <input className={styles.createSong} type="submit" value="Create" />
          </form>
        </div>
        <div className="song-list">
          {
            this.state.songData.map((song) => {
              return (
                <div className={styles.songListItem}>
                  <div className={styles.songListTitle}>{ song.title }</div>
                  <div className={styles.songListDate}>{ song.dateCreated }</div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
