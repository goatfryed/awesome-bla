import React from "react";
import Authentication from "../../authentication/Authentication";
import { NavLink } from "react-router-dom";

export class Navbar extends React.Component {
  //Authentification
  constructor(props) {
    super(props);
    this.authenticated = this.authenticated.bind(this);
    Authentication.addAuthenticationListener(this);

    this.state = { url: "" };
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
  //------------------
  render() {
    return (
      <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
          </a>

          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <span class="navbar-item">
              <NavLink exact to="/" activeClassName="activeLink">
                Home
              </NavLink>
            </span>
            <span class="navbar-item">
              <NavLink to="/friends" activeClassName="activeLink">
                Friends
              </NavLink>
            </span>
            <span class="navbar-item">
              <NavLink to="/listentry/new" activeClassName="activeLink">
                [WIP] ListEntryNew
              </NavLink>
            </span>
            <span class="navbar-item">
              <NavLink to="/bucketlists/all" activeClassName="activeLink">
                [WIP] DisplayAllBucketLists
              </NavLink>
            </span>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              {/* Authentication */}
              {Authentication.isAuthenticated() && (
                <a class="button is-primary" onClick={Authentication.logout}>
                  <strong>Logout</strong>
                </a>
              )}
              {!Authentication.isAuthenticated() && (
                <a class="button is-primary" href={this.state.url}>
                  <strong>Login</strong>
                </a>
              )}
              {Authentication.isAuthenticated() && (
                <a class="button is-light">
                  <strong>{Authentication.getUser().sub}</strong>
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
