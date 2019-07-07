import React from "react";
import {backend} from "../../Configuration";

export class users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            lastSearch: null,
            timeout: null,
            onLoading: false
        };
        this.searchUserChanged = this.searchUserChanged.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
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
                <a>Add as Friend</a> |&nbsp;
                <a>Show Bucketlists</a>
            </li></span>
        });

        return (
            <div className='postList'>
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

    searchUsers(name){
        this.state.onLoading=false;
        if(name === this.state.lastSearch)
        {
            return;
        }
        this.state.lastSearch = name;
        if(name === ""){
            fetch(backend + '/api/users/all')
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    this.setState({
                        users: data
                    });
                })
        }else{
            fetch(backend + '/api/users/find?name='+name)
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

}