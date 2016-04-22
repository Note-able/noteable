'use strict';

const React = require(`react`);
const Router = require('react-router');

module.exports = class HomeController extends React.Component {
  componentDidMount() {
    setTimeout
  }

  render() {
    return(
      <div className="home-container">
        <div className="navbar">
          <div className="signin-button">Sign in</div>
        </div>
        <div className="main-content">
          <div className="header">
            <h1 className="header__title"><span className="cursor">Be Inspired.</span></h1>
            <h5 className="header__sub-title">Connect, Create, and Collaborate with artists near you</h5>
            <div className="account-registration">
              <div className="account-registration__component">
                <input className="email" placeholder="Email"/>
              </div>
              <div className="account-registration__component">
                <input className="password" type="password" placeholder="Password"/>
              </div>
              <div className="account-registration__submit">
                <button className="submit-button" type="submit">Submit</button>
              </div>
            </div>
          </div>
          <div className="connect">
            <div className="graphic">
            </div>
            <div className="content">
              <h1>Connect</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
          </div>
          <div className="create">
            <div className="content">
              <h1>Create</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
            <div className="graphic">
            </div>
          </div>
        </div>
      </div>
    );
  }
}
