import React, { Component } from 'react';
import { backendFetch } from "../../api";

class ListSearch extends Component {
	state = {
		searchterm: ""
	};

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	handleSubmit = (event) => {
        event.preventDefault();
        let test = this.state.searchterm;
        console.log(test);
        backendFetch.get("/bucketlists/search/"+ this.state.searchterm)
        .then(response => {
			console.log(response);
			var resultsHtml = "";
			for(var i=0; i<response.length;i++){
				resultsHtml += response[i].title+" | ";
			}
			console.log(resultsHtml);
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div>
					<h2>Öffentliche Listen durchsuchen</h2>
					<div>
						<input
							className="input"
							type="text"
							name="searchterm"
							placeholder="Search lists..."
							autoFocus={true}
							value={this.state.searchterm}
							onChange={this.handleChange}
							maxLength={1024}
						/>
					</div>
				</div>
			</form>
		);
	}
}

export default ListSearch;
