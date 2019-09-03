import React, {PureComponent, useEffect,useCallback} from "react";
import PropTypes from "prop-types";
import {backendFetch} from "../../api";
import moment from "moment";

export default class BucketListEntryDetails extends PureComponent {

    static managedFields = ["title", "description", "dueDate"];

    static fieldRenderes = {
        "dueDate": DateTimeFieldRenderer,
    };

    state = {};

    constructor({selectedEntry, ...props}) {
        super({...props, selectedEntry: selectedEntry || {}});

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
                () => this.setState({loading: false})
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
                field => {
                    let FieldRenderer = BucketListEntryDetails.fieldRenderes[field] || DefaultFieldRenderer;
                    return <FieldRenderer key={field}
                        value={this.state[field]}
                        onChange={value => this.setState({[field]: value})}
                        fieldLabel={field}
                    />
                }
            )}
            <button type="submit" className="btn" disabled={this.hasChanges()}>Update</button>
        </form>;
    }
}

BucketListEntryDetails.propTypes = {
    refresh: PropTypes.func.isRequired,
    pagePath: PropTypes.string.isRequired,
    selectedEntry: PropTypes.object,
    isLoading: PropTypes.bool,
};

const RendererPropTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

function DefaultFieldRenderer({onChange, value, fieldLabel}) {
    return <div className="row">
        <div className="col s12">
            <label style={{"text-transform": "capitalize"}}>{fieldLabel}</label>
            <input className="input" value={value} onChange={e => onChange(e.target.value)}/>
        </div>
    </div>
}
DefaultFieldRenderer.propTypes = RendererPropTypes;

function DateTimeFieldRenderer({onChange, value}) {

    let updateDateTime = useCallback(
        e => {
            let val = e.target.value;
            if (val === "") {
                onChange(null);
            } else {
                onChange(new Date(val));
            }
        },
        [onChange]
    );

    console.log(value);


    return <div className="row">
        <div className="col">
            <label>Due date</label>
            <input type="datetime-local" value={!!value ? moment(value).format(moment.HTML5_FMT.DATETIME_LOCAL) : ""}
                onChange={updateDateTime}
            />
        </div>
    </div>
}

DateTimeFieldRenderer.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
};