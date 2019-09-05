import React from "react";
import Authentication from "../../authentication/Authentication";
import {Link, NavLink} from "react-router-dom";
import {backend, isDebug} from "../../Configuration";
import {Navbar, Icon} from "react-materialize";
import Button from "react-materialize/lib/Button";
import NavItem from "react-materialize/lib/NavItem";

export class AppNavbar extends React.Component {
    //Authentification
    constructor(props) {
        super(props);
        this.authenticated = this.authenticated.bind(this);
        Authentication.addAuthenticationListener(this);

        this.state = {url: ""};
        this.fakeLogin = this.fakeLogin.bind(this);
    }

    componentDidMount() {
        // Retrieve URL for GithHub authentication from the backend.
        Authentication.getAuthenticationURL(url => {
            this.setState({url});
        });
    }

    authenticated() {
        this.forceUpdate();
    }

    fakeLogin(evt) {
        Authentication.fakeLogin(this.state.fakeUser);
    }

    testAcces(evt) {
        fetch(backend + "/test", {
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
        const logo = <Link to="/home"><img src="/logo/Logo_transparent2.PNG" className="navbar-logo" alt="logo"/><span
            className="logo-text">Awesome Bucket List</span></Link>;
        return (
            <Navbar brand={logo} className="light-blue app-navbar">
                <NavLink exact to="/home" activeClassName="activeLink">
                    Home
                </NavLink>
                <NavLink to="/search" activeClassName="activeLink">
                    Search Lists
                </NavLink>
                <NavLink to="/users" activeClassName="activeLink">
                    Search Users
                </NavLink>
                {!Authentication.isAuthenticated() && isDebug && (
                    <NavItem>
                        <input type="text" className="debugInput" placeholder="Test user"
                               defaultValue={this.state.fakeUser}
                               onChange={e => (this.setState({fakeUser: e.target.value}))}/>
                        <Button waves="light" onClick={this.fakeLogin}>Debug</Button>
                    </NavItem>
                )}
                {Authentication.isAuthenticated() && (
                    <NavLink className="loginBtn" onClick={Authentication.logout}>
                        Logout
                    </NavLink>
                )}
                {!Authentication.isAuthenticated() && (
                    <NavLink className="loginBtn" to="/login">
                        Login
                    </NavLink>
                )}
                {Authentication.isAuthenticated() && (
                    <NavLink>
                        <Icon className="navbar-icons" left>
                            assignment_ind
                        </Icon>
                        <strong>{Authentication.getUser().sub}</strong>
                    </NavLink>
                )}
                {isDebug && (
                    <NavLink onClick={this.testAcces}>Test Authentication</NavLink>
                )}
            </Navbar>
        );
    }
}

export default Navbar;
