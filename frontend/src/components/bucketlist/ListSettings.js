import React from "react";
import {backendFetch} from "../../api";
import {Users} from "../basic-components/users";

export class ListSettings extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    //const privateList = props.bucketlist.private;
    this.state = {
      bucketList: props.bucketList,
      endPoint: "/api/users/byList?bucketlist="+props.bucketList.id
    };

    this.privateChanged = this.privateChanged.bind(this);
    this.makePriveleged = this.makePriveleged.bind(this);
    this.makeUnprieleged = this.makeUnprieleged.bind(this);
  }
  componentDidMount() {
  }


  privateChanged(){
    this.state.bucketList.private = !this.state.bucketList.private;
    this.forceUpdate();
  }

  makePriveleged(user){
    //console.log("Make user priveled");
    backendFetch.post("/bucketlists/"+this.state.bucketList.id+"/privelege/"+user.id).then(res=>{
      this.state.bucketList.accessed = res;
      this.refs.usersRef.forcepUpdateRequest();
      this.forceUpdate();
    })
  }

  makeUnprieleged(user){
    console.log("Make user unpriveled");
    backendFetch.post("/bucketlists/"+this.state.bucketList.id+"/unprivelege/"+user.id).then(res=>{
      this.state.bucketList.accessed = res;
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
        <div>Berechtiget user
          <div>
            {priv_users}
          </div>
        </div>
        <div>Berechtigungen zuteilen
          <Users ref="usersRef" text="Hier Text einfügen" onKlick={this.makePriveleged} endPoint={this.state.endPoint}></Users>
        </div>
      </div>
    };


    return (
        <apan>
          <div>
            <label>
              <input class="filled-in" type="checkbox" checked={this.state.bucketList.private} onChange={this.privateChanged} />
              <span>Private Liste</span>
            </label>
          </div>
          {this.state.bucketList.private?privateOptions():""}
        </apan>
    );
  }
}
