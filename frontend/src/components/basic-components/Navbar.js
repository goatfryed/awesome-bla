import React from "react";
import Authentication from "../../authentication/Authentication";
import { NavLink } from "react-router-dom";
import { backend, isDebug } from "../../Configuration";
import { Navbar } from "react-materialize";
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
        //const logo = <a href="/"><img src="/logo/Logo_transparent2.png" className="navbar-logo" alt="logo"></img><span>Awesome Bucket List</span></a>;
        return (
            <Navbar className="light-blue" alignLinks="left">
                <NavLink exact to="/" activeClassName="activeLink">
                    Home
                </NavLink>
                <NavLink to="/friends" activeClassName="activeLink">
                    Friends
                </NavLink>
                <NavLink to="/users" activeClassName="activeLink">
                    Benutzersuche
                </NavLink>
                {!Authentication.isAuthenticated() && isDebug && (
                    <NavItem className="right">
                        <input type="text" className="debugInput" placeholder="Test user" defaultValue={this.state.fakeUser} onChange={e => (this.state.fakeUser = e.target.value)} />
                        <Button onClick={this.fakeLogin}>Debug</Button>
                    </NavItem>
                )}
                {Authentication.isAuthenticated() && (
                    <NavItem>
                        <Button onClick={Authentication.logout}>
                            <strong>Logout</strong>
                        </Button>
                    </NavItem>
                )}
                {!Authentication.isAuthenticated() && (
                    <NavItem>
                        <Button href={this.state.url}>
                            <strong>Login</strong>
                        </Button>
                    </NavItem>
                )}
                {Authentication.isAuthenticated() && (
                    <NavItem>
                        <Button>
                            <strong>{Authentication.getUser().sub}</strong>
                        </Button>
                    </NavItem>
                )}
                {isDebug && (
                    <NavItem>
                        <Button onClick={this.testAcces}>Test Authentication</Button>
                    </NavItem>
                )}
            </Navbar>
        );
    }
}
export default Navbar;
