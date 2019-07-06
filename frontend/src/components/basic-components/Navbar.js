import React from "react";
import Authentication from "../../authentication/Authentication";
import { NavLink } from 'react-router-dom'
import {backend, isDebug} from "../../Configuration";

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

  fakeLogin(evt){
    Authentication.fakeLogin(this.state.fakeUser);
  }

  testAcces(evt){
    fetch(backend+"/api/test",{
      method: 'post',
      headers:{
        'Authorization': 'Bearer ' + Authentication.getToken(),
      },
      //'Accept': 'application/json'
    }).then((response) => {
      console.log(response);
    }).then(res=>{
      console.log("Error: "+res.status);
    }).then((err=>{
      console.log("Error: "+err.status);
    }))
  }

  //------------------
  render() {
    return (
      <nav>
        <li class="nav-wrapper">
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

           {!Authentication.isAuthenticated()?
              isDebug ?
                  <span><li><input type="text" defaultValue={this.state.fakeUser} onChange={e=>this.state.fakeUser=e.target.value}/></li><li><a onClick={this.fakeLogin}>Login</a></li></span>
              :
                <li><a href={this.state.url} className='header-link'>login</a></li>
              :""
            }
            {Authentication.isAuthenticated() && (
              <li>
                <a className="user-info">{Authentication.getUser().sub}</a>
              </li>
            )}
            {
              <li><a onClick={this.testAcces}>Test Authentication</a></li>
            }
          </ul>
        </li>
      </nav>
    );
  }
}
export default Navbar;
