import React from "react";
import {backendFetch} from "../../api";
import {Users} from "../basic-components/users";

export class ListSettings extends React.Component {

  //state = {};

  constructor(props) {
    super(props);
    //const privateList = props.bucketlist.private;
    this.state = {
      bucketList: props.bucketList,
      endPoint: "/users/byList?bucketlist=" + props.bucketList.id
    };

    this.privateChanged = this.privateChanged.bind(this);
    this.makePriveleged = this.makePriveleged.bind(this);
    this.makeUnprieleged = this.makeUnprieleged.bind(this);
  }

  componentDidMount() {
  }


  privateChanged(){
    backendFetch.post("/bucketlists/"+this.state.bucketList.id+"/private?value="+!this.state.bucketList.private).then(res=>{
      let bucketList = this.state.bucketList;
      bucketList.private = !this.state.bucketList.private;
      this.setState({bucketList:bucketList});
      //this.setState({bucketList: {private: !this.state.bucketList.private}});
      this.forceUpdate();
    });
  }

  makePriveleged(user){
    backendFetch.post("/bucketlists/"+this.state.bucketList.id+"/privelege/"+user.id).then(res=>{
      let bucketList = this.state.bucketList;
      bucketList.accessed = res;
      this.setState({bucketList:bucketList});
      //this.setState({bucketLists: {accessed: res}});
      this.refs.usersRef.forcepUpdateRequest();
      this.forceUpdate();
    })
  }

  makeUnprieleged(user){
    backendFetch.post("/bucketlists/"+this.state.bucketList.id+"/unprivelege/"+user.id).then(res=>{
      let bucketList = this.state.bucketList;
      bucketList.accessed = res;
      this.setState({bucketList:bucketList});
      //this.setState({bucketLists: {accessed: res}});
      this.refs.usersRef.forcepUpdateRequest();
      this.forceUpdate();
    })
  }

  render() {
    const priv_users = this.state.bucketList.accessed.map((user, index) => {
      return <span key={user.id}><li>
                <b>{user.userName}</b> |&nbsp;
            <button type="submit" onClick={this.makeUnprieleged.bind(this,user)}>Entfernen</button> |&nbsp;
          </li></span>
    });

    const privateOptions = ()=>{
      return <div>
        <div>Allowed users
          <div>
            {priv_users}
          </div>
        </div>
        <div>Berechtigungen zuteilen
          <Users ref="usersRef" text="Allow access" onKlick={this.makePriveleged} endPoint={this.state.endPoint}/>
        </div>
      </div>
    };


    return (
        <span>
          <div>
            <label>
              <input className="filled-in" type="checkbox" checked={this.state.bucketList.private} onChange={this.privateChanged} />
              <span>Private list</span>
            </label>
          </div>
          {this.state.bucketList.private?privateOptions():""}
        </span>
    );
  }
}
