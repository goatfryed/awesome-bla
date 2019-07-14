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

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
  }

  handleChange(evt) {
  }

  render() {
    return (
        <div>
          <input type="checkbox" checked={this.state.bucketList.private}/> Private Liste
        </div>
    );
  }
}
