import React from "react";
import {Link} from "react-router-dom";
import Authentication from "./Authentication";
import {isDebug,backend} from "./Configuration";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.authenticated = this.authenticated.bind(this);
        Authentication.addAuthenticationListener(this);
        this.state = {url: '',fakeUser: "User1"};

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

    render() {
        return (
            <div className="header">
                --- header -
                {
                    Authentication.isAuthenticated() &&
                    <a className='header-link user-info' onClick={Authentication.logout}>logout</a>
                } -
                {
                    !Authentication.isAuthenticated()?
                        isDebug ?
                        <div><input type="text" defaultValue={this.state.fakeUser} onChange={e=>this.state.fakeUser=e.target.value}/><button onClick={this.fakeLogin}>Login</button></div>
                        :
                            <a href={this.state.url} className='header-link'>login</a>
                    :""
                } -
                {
                    Authentication.isAuthenticated() &&
                    <span className='user-info'>{Authentication.getUser().sub}</span>
                }
                 ---
                <button onClick={this.testAcces}>test</button>
            </div>
        )
    }
}
