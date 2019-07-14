import React from "react";
import {backendFetch} from "../../api";

export class ListSettings extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    //const privateList = props.bucketlist.private;
    this.state = {
      bucketList: props.bucketList
    };

    this.privateChanged = this.privateChanged.bind(this);

  }
  componentDidMount() {
  }


  privateChanged(){
    this.state.bucketList.private = !this.state.bucketList.private;
    this.forceUpdate();
  }

  render() {

    const users = this.state.bucketList.accessed.map((user, index) => {
      return <span key={user.id}><li>
                <b>{user.userName}</b> |&nbsp;
        <a>Löschen</a> |&nbsp;
            </li></span>
    });

    const privateOptions = ()=>{
      return <div>Berechtiget user
        <div>
          {users}
        </div>
      </div>
    };


    return (
        <span>
          <div>
            <input type="checkbox" checked={this.state.bucketList.private} onChange={this.privateChanged}/> Private Liste
          </div>
          {this.state.bucketList.private?privateOptions():""}
        </span>
    );
  }
}
