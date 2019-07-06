import React from "react";
import {Link} from "react-router-dom";
import Authentication from "./Authentication";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.authenticated = this.authenticated.bind(this);
        Authentication.addAuthenticationListener(this);

        this.state = {url: ''}
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

    render() {
        return (
            <div className="header">
                --- header -
                {
                    Authentication.isAuthenticated() &&
                    <a className='header-link user-info' onClick={Authentication.logout}>logout</a>
                } - 
                {
                    !Authentication.isAuthenticated() &&
                    <a href={this.state.url}
                       className='header-link'>login</a>
                } - 
                {
                    Authentication.isAuthenticated() &&
                    <span className='user-info'>{Authentication.getUser().sub}</span>
                }
                 ---
            </div>
        )
    }
}
