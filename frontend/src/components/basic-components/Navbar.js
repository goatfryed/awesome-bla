import React from "react";
import Authentication from "../../authentication/Authentication";
import { NavLink } from "react-router-dom";
import { backend, isDebug } from "../../Configuration";

export class Navbar extends React.Component {
  //Authentification
  constructor(props) {
    super(props);
    this.authenticated = this.authenticated.bind(this);
    Authentication.addAuthenticationListener(this);

    this.state = { url: "" };
    this.fakeLogin = this.fakeLogin.bind(this);
  }
  componentDidMount() {
    // Retrieve URL for GithHub authentication from the backend.
    Authentication.getAuthenticationURL(url => {
      this.setState({ url });
    });
  }
  authenticated() {
    this.forceUpdate();
  }

  fakeLogin(evt) {
    Authentication.fakeLogin(this.state.fakeUser);
  }

  testAcces(evt) {
    fetch(backend + "/api/test", {
      method: "post",
      headers: {
        Authorization: "Bearer " + Authentication.getToken()
      }
      //'Accept': 'application/json'
    })
      .then(response => console.log(response))
      .catch(err => {
        console.log("Error: " + err);
      });
  }

  //------------------
  render() {
    return (
      <nav className="navbar has-shadow is-light" role="navigation" aria-label="main navigation">
        <div id="navbar" className="navbar-menu">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <img src="/logo/Logo_transparent2.png" alt="logo"/>
            </a>
          </div>
          <div className="navbar-start">
            <span className="navbar-item">
              <NavLink exact to="/" activeClassName="activeLink">
                Home
              </NavLink>
            </span>
            <span className="navbar-item">
              <NavLink to="/friends" activeClassName="activeLink">
                Friends
              </NavLink>
            </span>
            <span className="navbar-item">
              <NavLink to="/bucketlists/all" activeClassName="activeLink">
                [WIP] DisplayAllBucketLists
              </NavLink>
            </span>
          </div>
        </div>
        <div className="navbar-end">
          {/* Authentication */}
          {!Authentication.isAuthenticated() && isDebug && (
            <div className="navbar-item">
              <div className="field has-addons">
                <div className="control">
                  <input className="input" type="text" placeholder="Test user" defaultValue={this.state.fakeUser} onChange={e => (this.state.fakeUser = e.target.value)} />
                </div>
                <div className="control">
                  <a className="button is-link" onClick={this.fakeLogin}>
                    Debug
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className="navbar-item">
            <div className="buttons">
              {Authentication.isAuthenticated() && (
                <a className="button is-primary" onClick={Authentication.logout}>
                  <strong>Logout</strong>
                </a>
              )}
              {!Authentication.isAuthenticated() && (
                <a className="button is-primary" href={this.state.url}>
                  <strong>Login</strong>
                </a>
              )}
              {Authentication.isAuthenticated() && (
                <a className="button is-light">
                  <strong>{Authentication.getUser().sub}</strong>
                </a>
              )}
              {isDebug && (
                <a className="button is-link" onClick={this.testAcces}>
                  Test Authentication
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
export default Navbar;
