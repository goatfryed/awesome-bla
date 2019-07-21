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
                <Users text={"Bucketlisten anzeigen"} onKlick={this.showBucketLists}></Users>
            </div>
        );
    }

    showBucketLists(){
        console.log("Show Bucketliststs")
    }
}