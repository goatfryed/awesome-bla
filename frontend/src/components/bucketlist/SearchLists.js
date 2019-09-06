import React, { Component } from 'react';
import { backendFetch } from "../../api";

//Component to search lists
class ListSearch extends Component {
	state = {
		searchterm: "",
		lists: [],
	};

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	//Search when state changes
	componentDidUpdate(prevProps, prevState) {
		if (prevState.searchterm !== this.state.searchterm) {
			this.handleSubmit();
		}
	}

	handleSubmit = () => {
		if (this.state.searchterm.length > 0) {
			backendFetch.get("/bucketlists/search/" + this.state.searchterm)
				.then(response => {
					console.log(response);
					this.setState({ lists: response });
				});
		} else {
			this.setState({ lists: [] })
		}
	}
	render() {
		const results = this.state.lists;
		let resultstable;
		if (results.length > 0) {
			resultstable = this.state.lists.map((list) =>
				<a alt={list.title} key={list.id} href={"/bucketlist/" + list.id}>
					<div className="collection-item grey lighten-3">{list.title} von {list.owner.userName}</div>
				</a>
			)
		} else {
			resultstable = <div className="collection-item grey lighten-3">No Results</div>
		}
		return (
			<>
				<form onSubmit={this.handleSubmit}>
					<div>
						<h2>Search lists</h2>
						<div>
							<input
								className="input"
								type="text"
								name="searchterm"
								placeholder="Search lists by title..."
								autoComplete="off"
								autoFocus={true}
								value={this.state.searchterm}
								onChange={this.handleChange}
								maxLength={1024}
							/>
						</div>
					</div>
				</form>
				<div className="collection">
					{resultstable}
				</div>
			</>
		);
	}
}

export default ListSearch;
