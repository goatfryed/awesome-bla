import React from "react";
import {backend} from "../../Configuration";

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
            endPoint: "/api/users/find"
        };
        if(props.endPoint != null){
            this.state.endPoint = props.endPoint;
        }
        this.searchUserChanged = this.searchUserChanged.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.getEndPointUrl = this.getEndPointUrl.bind(this);
    }

    searchUserChanged(ev){
        let name = ev.target.value;
        if(name.startsWith("#")){
            return;
        }
        this.state.onLoading=true;
        if (this.state.timeout !== null) {
            clearTimeout(this.state.timeout);
        }
        this.state.timeout = setTimeout(ev=>{
            this.searchUsers(name);
        }, 1000);
        this.forceUpdate();
        //this.searchUsers(name);
    }

    render() {
        const users = this.state.users.map((user, index) => {
            return <span key={user.id}><li>
                <b>{user.userName}</b> |&nbsp;
                <a onClick={this.state.onKlick(user)}>{this.state.text}</a> |&nbsp;
            </li></span>
        });

        return (
            <div className='content'>
                Benutzersuche: <input type="text" defaultValue="#Username" onChange={this.searchUserChanged}/>
                {this.state.onLoading?"Loading...":""}
                <ul>
                    {users}
                </ul>
            </div>
        )
    }

    componentDidMount() {
        this.searchUsers("");
    }

    getEndPointUrl(name){
        if(this.state.endPoint.includes("?")){
            return backend + this.state.endPoint+'&name='+name
        }else{
            return backend + this.state.endPoint+'?name='+name
        }
    }

    searchUsers(name){
        this.state.onLoading=false;
        if(name === this.state.lastSearch)
        {
            return;
        }
        this.state.lastSearch = name;
        fetch(this.getEndPointUrl(name))
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                this.setState({
                    users: data
            });
        })
    }

}