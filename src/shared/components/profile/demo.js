import React from 'react';
import AJAX from '../../ajax';

class Profile extends React.Component {
  render () {
    return (
      <div>
        <div className="profile-four">
          <div className="navbar">
          </div>
          <div className="profile-container">
            <div className="user-info-container">
              <div className="darken"></div>
              <div className="user-info__avatar">
                <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
              </div>
              <div className="user-info">
                <div className="user-info__username">Michael Nakayama</div>
                <div className="user-info__name">Sportnak &bull; </div>
                <div className="user-info__location">Bellingham, WA</div>
                <div className="action-container">
                  <a href="#">
                    <div className="action">Follow</div>
                  </a>
                  <a href="#">
                    <div className="action">Message</div>
                  </a>
                </div>
              </div>
              <div className="user-info-actions">
                <div className="after" style={{left: '50%'}}/>
                <a className="user-info-actions__events" href="#"><div ><strong>158</strong> Events</div></a>
                <a className="user-info-actions__followers user-info-actions__active" href="#"><div><strong>2.4k</strong> Followers</div></a>
                <a className="user-info-actions__following" href="#"><div><strong>152</strong> Following</div></a>
              </div>
            </div>
              <ol className="information-container">
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                </ol>
          </div>
        </div>
        <div className="profile-two">
          <div className="navbar">
          </div>
          <div className="profile-container">
            <div className="user-info-container">
                <div className="user-info__avatar">
                  <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                </div>
              <div className="user-info">
                <div className="user-info__username">Michael Nakayama</div>
                <div className="user-info__name">Sportnak &bull; </div>
                <div className="user-info__location">Bellingham, WA</div>
                <div className="action-container">
                  <a href="#">
                    <div className="action">Follow</div>
                  </a>
                  <a href="#">
                    <div className="action">Message</div>
                  </a>
                </div>
              </div>
              <div className="user-info-actions">
                <div className="after" style={{left: '50%'}}/>
                <a className="user-info-actions__events" href="#"><div ><strong>158</strong> Events</div></a>
                <a className="user-info-actions__followers user-info-actions__active" href="#"><div><strong>2.4k</strong> Followers</div></a>
                <a className="user-info-actions__following" href="#"><div><strong>152</strong> Following</div></a>
              </div>
              <ol className="information-container">
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620"/>
                    <div className="user-information">
                      <div className="user-information__name"><strong>Ian Mundy</strong></div>
                      <div classname="user-information__location">Nashville, TN</div>
                    </div>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                  <li className="user">
                    <img src="https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4"/>
                  </li>
                </ol>
            </div>
            <div className="user-display-container">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Profile;