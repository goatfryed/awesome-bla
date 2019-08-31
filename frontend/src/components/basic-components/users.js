import React from "react";
import {backend} from "../../Configuration";
import moment from "../bucketlist/BucketListEntries";
import {backendFetch} from "../../api";

export class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            lastSearch: null,
            timeout: null,
            onLoading: false,
            text: props.text,
            onKlick: props.onKlick,
            endPoint: "/users/find",
            lastingElements: null,
            loadedPages: 0
        };
        if(props.endPoint != null){
            this.state.endPoint = props.endPoint;
        }
        this.searchUserChanged = this.searchUserChanged.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.getEndPointUrl = this.getEndPointUrl.bind(this);
        this.forcepUpdateRequest = this.forcepUpdateRequest.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    searchUserChanged(ev){
        let name = ev.target.value;
        this.state.users = [];
        this.state.loadedPages = 0;
        this.state.lastingElements = null;
        if(name.startsWith("#")){
            return;
        }
        this.state.onLoading=true;
        if (this.state.timeout !== null) {
            clearTimeout(this.state.timeout);
        }
        this.state.timeout = setTimeout(ev=>{
            this.searchUsers(name,false);
        }, 1000);
        this.forceUpdate();
        //this.searchUsers(name);
    }

    render() {
        const moreSides = ()=>{
            return this.state.lastingElements == null ? '':this.state.lastingElements<=0?<div>Kine Weiteren User verfügbar</div>:<div>{this.state.lastingElements} weitere User <button type="submit" onClick={this.loadMore.bind(this,this.state.lastSearch)}>Laden</button></div>
        };

        const users = this.state.users.map((user, index) => {
            return <span key={user.id}><li class="active">
                <b>{user.userName}</b> |&nbsp;
                <button onClick={this.state.onKlick.bind(this,user)} type="submit">{this.state.text}</button>
            </li>
            </span>
        });

        return (
            <div>
                Benutzersuche: <input type="text" defaultValue="#Username" onChange={this.searchUserChanged}/>
                {this.state.onLoading?"Loading...":""}
                <ul>
                    {users}
                </ul>
                {moreSides()}
            </div>
        )
    }

    componentDidMount() {
        this.searchUsers("",false);
    }

    getEndPointUrl(name){
        if(this.state.endPoint.includes("?")){
            return this.state.endPoint+'&name='+name+"&page="+this.state.loadedPages
        }else{
            return this.state.endPoint+'?name='+name+"&page="+this.state.loadedPages
        }
    }

    forcepUpdateRequest(){
        this.state.users = [];
        this.searchUsers(this.state.lastSearch,true);
    }

    searchUsers(name,force){
        this.state.onLoading=false;
        if(force === false && name === this.state.lastSearch)
        {
            return;
        }
        this.state.lastSearch = name;
        this.loadMore(name,force);
    }

    loadMore(name,reload){
        backendFetch.get(this.getEndPointUrl(name)+(reload==true ? "&reload=true":""))
        .then((response) => {
            return response;
        })
        .then((response) => {
            if(response.content.length > 0){
                this.state.loadedPages++;
            }
            this.state.lastingElements = response.lastingElements;
            this.state.users = this.state.users.concat(response.content);
            this.forceUpdate();
        })
    }

}