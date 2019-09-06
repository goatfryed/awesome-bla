import React, {Component} from 'react';
import {backendFetch} from "../../api";
import {Button, Icon, Textarea} from "react-materialize";
//Create New Lists
class ListNew extends Component {
    state = {
        title: "",
        description: ""
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) => {
        if (this.state.title.length > 0) {
            event.preventDefault();
            backendFetch.post("/bucketlists/add", {
                body: JSON.stringify({
                        title: this.state.title,
                        description: this.state.description
                    }
                )
            }).then(response => {
                this.props.history.push("/");
            });
        }
    }

    cancelForm = (event) => {
        event.preventDefault();
        this.props.history.push("/")
    }

    render() {
        return (
            <>
                <h2>Create new list</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <div>
                            <input
                                className="input"
                                type="text"
                                name="title"
                                placeholder="Enter title...."
                                autoFocus={true}
                                value={this.state.title}
                                onChange={this.handleChange}
                                maxLength={1024}
                            />
                        </div>
                    </div>
                    <div>
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
                    <div className="row">
                        <Button type="submit" waves="light" className="submitBtn">
                            Create
                            <Icon right>
                                send
                            </Icon>
                        </Button>
                        <Button className="cancelBtn" onClick={this.cancelForm}>Cancel</Button>
                    </div>
                </form>
            </>
        );
    }
}

export default ListNew;
