import React from "react";
import {Users} from "../basic-components/users";

export class allUsers extends React.Component {

    constructor(props) {
        super(props);
        this.showBucketLists = this.showBucketLists.bind(this);
    }

    render() {
        return (
            <div>
                <Users text={"Show bucketlists"} onKlick={this.showBucketLists}/>
            </div>
        );
    }

    showBucketLists(user){
        //console.log("Show Bucketliststs");
        this.props.history.push("/home/user/"+user.userName);
    }
}