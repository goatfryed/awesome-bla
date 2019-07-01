import React from "react";
import backend from '../configuration';

export class ListEntryNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            //url: '',
            description: '',
            listID: null
        };

        // See https://medium.freecodecamp.org/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb
        // for a very detailed explanation of this.
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // See https://medium.com/@tmkelly28/handling-multiple-form-inputs-in-react-c5eb83755d15 for working with forms
    // with multiple elements.
    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch(backend + '/api/bucketlists/'+this.state.listID+'/entries/add', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'Authorization': 'Bearer ' + Authentication.getToken()
            },
            body: JSON.stringify({
                title: this.state.title,
                //url: this.state.url,
                description: this.state.description
            })
        })
            .then(response => {
                // Redirect only a successful update.
                //this.props.history.push('/');
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className='new-post'>
                <div>
                    <label>
                        <span>title</span>
                        <input type="text" name="title" autoFocus={true} value={this.state.title}
                               onChange={this.handleChange}
                               maxLength={1024}/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Description</span>
                        <textarea name='description' value={this.state.description}
                                  onChange={this.handleChange}
                            // We will later use a value from the backend instead of a hardcoded one.
                                  maxLength={4096}
                        ></textarea>
                    </label>
                </div>
                <div>
                    <label>
                        <span>ListID</span>
                        <input type="number" name='listID' value={this.state.listID}
                                  onChange={this.handleChange}
                            // We will later use a value from the backend instead of a hardcoded one.
                                  maxLength={4096}
                        ></input>
                    </label>
                </div>
                <div className='button'>
                    <input type="submit" value="submit"/>
                </div>
            </form>
        );
    }
}