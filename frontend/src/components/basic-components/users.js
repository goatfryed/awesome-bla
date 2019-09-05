import React from "react";
import {backendFetch} from "../../api";
import {Button} from "react-materialize"

export class Users extends React.Component {

    state = {};

    constructor(props) {
        super(props);
        console.log(props.endPoint);
        this.state = {
            users: [],
            lastSearch: null,
            timeout: null,
            onLoading: false,
            text: props.text,
            endPoint: props.endPoint === undefined ? "/users/find":props.endPoint,
            lastingElements: null,
            loadedPages: 0,
            onKlick: props.onKlick === undefined ? null : props.onKlick
        };

        this.searchUserChanged = this.searchUserChanged.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.getEndPointUrl = this.getEndPointUrl.bind(this);
        this.forcepUpdateRequest = this.forcepUpdateRequest.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    searchUserChanged(ev){
        let name = ev.target.value;
        this.setState({
            users: [],
            loadedPages: 0,
            lastingElements: null
        });
        if(name.startsWith("#")){
            return;
        }
        if (this.state.timeout !== null) {
            clearTimeout(this.state.timeout);
        }
        this.setState({
            onLoading: true,
            timeout: setTimeout(ev=>{
                    this.searchUsers(name,false);
                }, 1000
            ),
        });
        this.forceUpdate();
    }

    render() {
        const moreSides = ()=>{
            return this.state.lastingElements === null ? '':this.state.lastingElements<=0?<div>No more Users available</div>:<div>{this.state.lastingElements} weitere User <button type="submit" onClick={this.loadMore.bind(this,this.state.lastSearch)}>Laden</button></div>
        };

        const dobutton = (user)=>{
            return this.state.onKlick !== null?<Button small className="floatRight allowAccessBtn" onClick={this.state.onKlick.bind(this,user)} type="submit">{this.state.text}</Button>:'';
        };

        const users = this.state.users.map((user, index) => {
            return <span key={user.id}><li className="collection-item grey lighten-3">
                <b>{user.userName}</b>
                {dobutton(user)}
            </li>
            </span>
        });

        return (
            <div>
                <h2>Search users:</h2>
                <input type="text" defaultValue="#Username" onChange={this.searchUserChanged}/>
                {this.state.onLoading?"Loading...":""}
                <ul className="collection grey lighten-1">
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
        this.setState({lastSearch: name});
        this.loadMore(name,force);
    }

    loadMore(name,reload){
        backendFetch.get(this.getEndPointUrl(name)+(reload==true ? "&reload=true":""))
        .then((response) => {
            return response;
        })
        .then((response) => {
            if(response.content.length > 0){
                this.setState({loadedPages: this.state.loadedPages+1})
            }
            this.setState({
                lastingElements: response.lastingElements,
                users: this.state.users.concat(response.content)
            });
            this.forceUpdate();
        })
    }

}