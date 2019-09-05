import React, {Component} from 'react';
import {backendFetch} from "../../api";
import {Button, Icon, Textarea} from "react-materialize";

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
                <h2>Neue Liste erstellen</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <div>
                            <input
                                className="input"
                                type="text"
                                name="title"
                                placeholder="Titel eingeben..."
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
                            placeholder="Beschreibung eingeben..."
                            s={12}
                            m={12}
                            l={12}
                            xl={12}
                        />
                    </div>
                    <div className="row">
                        <Button type="submit" waves="light" className="submitBtn">
                            Erstellen
                            <Icon right>
                                send
                            </Icon>
                        </Button>
                        <Button className="cancelBtn" onClick={this.cancelForm}>Abbrechen</Button>
                    </div>
                </form>
            </>
        );
    }
}

export default ListNew;
