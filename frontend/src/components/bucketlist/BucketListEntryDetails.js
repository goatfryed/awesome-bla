import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {backendFetch} from "../../api";

export default class BucketListEntryDetails extends PureComponent {

    static managedFields = ["title", "description"];

    state = {};

    constructor({selectedEntry, ...props}) {
        super({selectedEntry: selectedEntry || {}, props});

        this.state = {
            ...this.entryStateFromProps(this.props)
        };

        [
            "onSubmit",
            "hasChanges"
        ].forEach(
            fn => this[fn] = this[fn].bind(this)
        );
    }

    entryStateFromProps(props) {
        let partialState = {};
        partialState.entry = props.selectedEntry;

        for (let field of BucketListEntryDetails.managedFields) {
            partialState[field] = partialState.entry[field] || "";
        }
        return partialState;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.selectedEntry !== this.state.entry) {
            this.setState(this.entryStateFromProps(nextProps));
        }
    }

    hasChanges() {
        return !BucketListEntryDetails.managedFields.some(f => {
            return (this.state.entry[f] || "") !== this.state[f]
        });
    }

    onSubmit(e) {
        e.preventDefault();

        let update = {};
        for (let field of BucketListEntryDetails.managedFields) {
            update[field] = this.state[field];
        }

        this.setState({loading: true, error: null});

        backendFetch.put(
            this.props.pagePath + "/" + this.state.entry.id + "/", {
                body: JSON.stringify(update)
            })
            .then(() => {
                this.setState({loading: false})
                this.props.refresh();
            })
            .catch(error => {
                console.log(error);
                this.setState({error});
            })
            .finally(
                this.setState({loading: false})
            )
        ;
    }

    render() {
        if (this.props.isLoading) {
            return <span>Loading</span>
        }

        return <form onSubmit={this.onSubmit}
        >
            {BucketListEntryDetails.managedFields.map(
                field => <input key={field} className="input" value={this.state[field]}
                                onChange={e => this.setState({[field]: e.target.value})}/>
            )}
            <button type="submit" className="button" disabled={this.hasChanges()}>Update</button>
        </form>;
    }
}

BucketListEntryDetails.propTypes = {
    refresh: PropTypes.func.isRequired,
    pagePath: PropTypes.string.isRequired,
    selectedEntry: PropTypes.object,
    isLoading: PropTypes.bool,
};