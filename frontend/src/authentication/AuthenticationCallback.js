import React from "react";

import Authentication from "./Authentication";
import {backend} from "../Configuration";

export class AuthenticationCallback extends React.Component {
    constructor(props) {
        super(props);

        console.log("created callback");

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        this.state = {
            code
        }
    }

    componentDidMount(){
        // Call backend using submitted code.
        fetch( backend+"/authentication/callback?code=" + this.state.code)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                Authentication.parseToken(data.token);
                this.props.history.push('/');
            })
    }

    render() {
        // You could add a list of authentication providers here.
        return <span>Authentication Callback</span>;
       // return null;
    }
}
