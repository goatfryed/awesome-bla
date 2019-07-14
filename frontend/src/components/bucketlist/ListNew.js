import React, { Component } from 'react';
import { backendFetch } from "../../api";

class ListNew extends Component {
	state = {
		title: "",
		description: ""
	};

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	handleSubmit = (event) => {
		event.preventDefault();
		backendFetch.post("/bucketlists/add", {
			body: JSON.stringify({
				title: this.state.title,
				description: this.state.description
			}
		)}).then(response => {
			this.props.history.push("/");
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div>
					<label>Title</label>
					<div>
						<input
							className="input"
							type="text"
							name="title"
							placeholder="Enter Title..."
							autoFocus={true}
							value={this.state.title}
							onChange={this.handleChange}
							maxLength={1024}
						/>
					</div>
				</div>
				<div>
					<label>Description</label>
					<div>
						<textarea
							className="textarea"
							name="description"
							value={this.state.description}
							onChange={this.handleChange}
							maxLength={4096}
						/>
					</div>
				</div>
				<div>
					<div>
						<input type="submit" value="Submit" />
					</div>
					<div>
						<button>Cancel</button>
					</div>
				</div>
			</form>
		);
	}
}

export default ListNew;
