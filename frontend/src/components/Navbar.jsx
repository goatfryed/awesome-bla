import React from "react";
import Authentication from "../authentication/Authentication";
import { NavLink } from 'react-router-dom'

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
      <nav>
        <div class="nav-wrapper">
          <a href="#!" class="brand-logo center">
            Logo
          </a>
          <ul id="nav-mobile" class="left hide-on-med-and-down">
            <li>
              <NavLink exact to="/" activeClassName="activeLink">Home</NavLink>
            </li>
            <li>
              <NavLink to="/friends" activeClassName="activeLink">Friends</NavLink>
            </li>
            {/* Authentication */}
            {Authentication.isAuthenticated() && (
              <li>
                <a onClick={Authentication.logout}>Logout</a>
              </li>
            )}
            {!Authentication.isAuthenticated() && (
              <li>
                <a href={this.state.url}>Login</a>
              </li>
            )}
            {Authentication.isAuthenticated() && (
              <li>
                <a className="user-info">{Authentication.getUser().sub}</a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
export default Navbar;
