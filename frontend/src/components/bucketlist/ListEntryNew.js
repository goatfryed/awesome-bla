import React from "react";
import {backendFetch} from "../../api";
import {Button, Icon, Textarea} from "react-materialize";

//Create a new listentry
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
        this.setState({listID: this.props.match.params.id});
        //this.state.listID = this.props.match.params.id
        console.log("Add entry to list: " + this.state.listID);
    }

    // See https://medium.com/@tmkelly28/handling-multiple-form-inputs-in-react-c5eb83755d15 for working with forms
    // with multiple elements.
    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.title.length > 0) {
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
    }

    cancelForm = (event) => {
        event.preventDefault();
        this.props.history.push("/bucketlist/" + this.state.listID);
    }

    render() {
        return (
            <>
                <h2>Create new listentry</h2>
                <form onSubmit={this.handleSubmit} className="new-post">
                    <div className="field">
                        <div className="control">
                            <input className="input" type="text" name="title" placeholder="Enter title..."
                                   autoFocus={true}
                                   value={this.state.title} onChange={this.handleChange} maxLength={1024}/>
                        </div>
                    </div>
                    <div className="field">
                        <Textarea
                            value={this.state.description}
                            onChange={this.handleChange}
                            name="description"
                            maxLength={4096}
                            placeholder="Enter description..."
                            s={12}
                            m={12}
                            l={12}
                            xl={12}
                        />
                    </div>
                    <div className="field is-grouped">
                        <Button type="submit" waves="light" className="submitBtn">
                            Create
                            <Icon right>
                                send
                            </Icon>
                        </Button>
                        <Button className="red" onClick={this.cancelForm}>Cancel</Button>
                    </div>
                </form>
            </>
        );
    }
}
