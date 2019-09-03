import React from "react";
import Authentication from "../../authentication/Authentication";
import { NavLink } from "react-router-dom";
import { backend, isDebug } from "../../Configuration";
import { Navbar, Icon } from "react-materialize";
import Button from "react-materialize/lib/Button";
import NavItem from "react-materialize/lib/NavItem";

export class AppNavbar extends React.Component {
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
        const logo = <a href="/"><img src="/logo/Logo_transparent2.png" className="navbar-logo" alt="logo"></img><span className="logo-text">Awesome Bucket List</span></a>;
        return (
            <Navbar brand={logo} className="light-blue app-navbar">
                <NavLink exact to="/accessed" activeClassName="activeLink">
                    Access Bucket Lists
                </NavLink>
                <NavLink exact to="/" activeClassName="activeLink">
                    Home
                </NavLink>
                <NavLink to="/users" activeClassName="activeLink">
                    Benutzersuche
                </NavLink>
                <NavLink to="/search" activeClassName="activeLink">
                    Listensuche
                </NavLink>
                {!Authentication.isAuthenticated() && isDebug && (
                    <NavItem  className="navbar-btn">
                        <input type="text" className="debugInput" placeholder="Test user" defaultValue={this.state.fakeUser} onChange={e => (this.state.fakeUser = e.target.value)} />
                        <Button waves="light" onClick={this.fakeLogin}>Debug</Button>
                    </NavItem>
                )}
                {Authentication.isAuthenticated() && (
                    <NavItem className="navbar-btn">
                        <Button waves="light" onClick={Authentication.logout}>
                            <strong>Logout</strong>
                        </Button>
                    </NavItem>
                )}
                {!Authentication.isAuthenticated() && (
                    <NavItem className="navbar-btn">
                        <Button waves="light" href={this.state.url}>
                            <strong>Login</strong>
                        </Button>
                    </NavItem>
                )}
                {Authentication.isAuthenticated() && (
                    <NavItem className="navbar-btn">
                        <Button waves="light">
                            <Icon className="navbar-icons" left>
                                assignment_ind
                            </Icon>
                            <strong>{Authentication.getUser().sub}</strong>
                        </Button>
                    </NavItem>
                )}
                {isDebug && (
                    <NavItem className="navbar-btn">
                        <Button waves="light" onClick={this.testAcces}>Test Authentication</Button>
                    </NavItem>
                )}
            </Navbar>
        );
    }
}
export default Navbar;
