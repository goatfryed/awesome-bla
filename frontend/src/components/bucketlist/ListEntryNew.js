import React from "react";
import {backendFetch} from "../../api";

export class ListEntryNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      //url: '',
      description: "",
      listID: 0
    };

    // See https://medium.freecodecamp.org/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb
    // for a very detailed explanation of this.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.setState({ listID: this.props.match.params.id });
    //this.state.listID = this.props.match.params.id
    console.log("Add entry to list: " + this.state.listID);
  }

  // See https://medium.com/@tmkelly28/handling-multiple-form-inputs-in-react-c5eb83755d15 for working with forms
  // with multiple elements.
  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    backendFetch.post("/bucketlists/" + this.state.listID + "/entries/add", {
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description
      })
    }).then(response => {
      // Redirect only a successful update.
      this.props.history.push("/bucketlist/" + this.state.listID);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="new-post">
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input class="input" type="text" name="title" placeholder="Enter Title..." autoFocus={true} value={this.state.title} onChange={this.handleChange} maxLength={1024} />
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea
              class="textarea"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              // We will later use a value from the backend instead of a hardcoded one.
              maxLength={4096}
            />
          </div>
        </div>
        <div>
          <label>
            <div>[DEBUG] ListID</div>
            <input
              disabled
              type="number"
              name="listID"
              value={this.state.listID}
              onChange={this.handleChange}
              // We will later use a value from the backend instead of a hardcoded one.
              maxLength={4096}
            />
          </label>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <input type="submit" class="button is-link" value="Submit" />
          </div>
          <div class="control">
            <button class="button is-text">Cancel</button>
          </div>
        </div>
      </form>
    );
  }
}
