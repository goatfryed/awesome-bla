import React, {PureComponent, useEffect, useState} from "react";
import {CommentsBlock} from "./Comments";
import {backendFetch} from "../../api";
import {withRouter} from "react-router";
import moment from "moment";

export function BucketListEntries({id}) {
    let pagePath = "/bucketlists/"+id+"/entries";

    let [entries, setEntries] = useState(null);
    let [selectedEntry, setSelectedEntry] = useState(null);

    let update = async () => {
        const json = await backendFetch(pagePath + "/");
        setEntries(json);
    };

    useEffect(() => {
            update();
        },
        [pagePath]
    );
    return <div className="columns">
        <div  className="column">
            <ul className="collection">
            {entries && entries.map( entry => <BucketListEntry key={entry.id} entry={entry} pagePath={pagePath} forceUpdate={update} onSelect={setSelectedEntry}/>)}
            </ul>
        </div>
        {selectedEntry && <div className="column"><EntryDetails selectedEntry={selectedEntry} onUpdate={update} pagePath={pagePath} /></div> }
    </div>;
}

class EntryDetails extends PureComponent {

    static managedFields = ["title", "description"];

    state = {};

    constructor(props) {
        super(props);

        this.state = {
            ...this.entryStateFromProps(props)
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

        for (let field of EntryDetails.managedFields) {
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
        return !EntryDetails.managedFields.some(f => {
            return (this.state.entry[f] || "") !== this.state[f]
        });
    }

    onSubmit(e) {
        e.preventDefault();

        let update = {};
        for (let field of EntryDetails.managedFields) {
            update[field] = this.state[field];
        }

        this.setState({loading: true, error: null});

        backendFetch.put(
            this.props.pagePath + "/" + this.state.entry.id + "/", {
                body: JSON.stringify(update)
            })
            .then( () => {
                this.setState({loading: false})
                this.props.onUpdate();
            })
            .catch( error => {
                console.log(error);
                this.setState({error});
            })
            .finally(
                this.setState({loading: false})
            )
        ;
    }

    render() {
        return <form onSubmit={this.onSubmit}
        >
            {EntryDetails.managedFields.map(
                field => <input key={field} className="input" value={this.state[field]} onChange={e => this.setState({[field]: e.target.value})}/>
            )}
            <button type="submit" className="button" disabled={this.hasChanges()}>Update</button>
        </form>;
    }
}

const BucketListEntry = withRouter(BucketListEntryView);

function BucketListEntryView({entry, pagePath, forceUpdate, history, onSelect}) {
    let [showDetails, setShowDetails] = useState(false);


    async function toggleCompletionState(wasCompleted) {
        let nextEntryState = {
            completed: wasCompleted ? null : Date.now()
        };

        const response = await backendFetch.put(
            pagePath + "/" + entry.id + "/", {
            body: JSON.stringify(nextEntryState)
        });
        forceUpdate();
    }

    let onToggleDone = e => {
        e.stopPropagation();
        e.preventDefault();
        toggleCompletionState(entry.completed);
    };

    async function copyEntryToBucketList() {
        let targetListId = NaN;
        while (isNaN(targetListId)) {
            let input = prompt("id of target bucket list?");
            if (input === null) {
                return;
            }
            targetListId = parseInt( input);
        }
        await backendFetch.post("/bucketlists/" + targetListId + "/entries/cloneEntry/" + entry.id + "/");

        let returnValue = window.confirm("Do you want to see your list?");
        if (returnValue) {
            history.push({pathname: "/bucketlist/" + targetListId + "/entries/"});
        }
    }

    return <li className="collection-item">
        <div>
            <input type="checkbox"
                   checked={entry.completed || false}
                   onChange={onToggleDone}
                   // don't let the onClick handler for expander fire, if this checkbox is toggled
                   onClick={event => event.stopPropagation()}
            />&nbsp;<a onClick={e => {e.preventDefault(); onSelect(entry)}}>{entry.title}</a>
            <small>
                 ·
                {moment(entry.created).fromNow()}
                 · <button onClick={() => setShowDetails(!showDetails)}>Talk</button>
                 · <button onClick={copyEntryToBucketList}>copy</button>
            </small>
        </div>
        {showDetails && <ExtendedEntry entry={entry} pagePath={pagePath}/>}
    </li>;
}

function ExtendedEntry({entry, pagePath}) {
    let [details, setDetails] = useState(null);

    let entryPath = pagePath+"/"+entry.id+"/";

    async function update() {
        const json = await backendFetch( entryPath);
        setDetails(json);
    }

    useEffect(
        function () {update();},
        [entryPath]
    );

    async function onCommentCreation(comment, url) {
        await createComment(comment, url);
        return await update();
    }

    function onCommentToEntry(comment) {
        return onCommentCreation(comment, entryPath + "comments/");
    }

    return details == null
        ? <div>"loading"</div>
        : <CommentsBlock
            comments={details.comments}
            onRootCommentCreation={onCommentToEntry}
            onReplyCreated={update}
        />
}



function createComment(comment, url) {
    return backendFetch.post(
        url,{
        body: JSON.stringify(comment)
    });
}