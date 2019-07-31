
import React from "react";
import {withRouter} from "react-router";
import {BucketListProvider} from "../bucketlist/ShowAllBucketLists";
import {backendFetch} from "../../api";

let ImportTargetSelection = withRouter(ImportBase);

function InvalidState() {
    return <span>Nothing to import</span>;
}

function ImportBase({location, history}) {

    console.log(history);
    if (!location.state || !location.state.from) {
        return <InvalidState/>
    }
    let clonePath;
    let description;

    if (location.state.entry) {
        clonePath = "/entries/cloneEntry/" + location.state.entry.id + "/";
        description = <span>entry <code>{location.state.entry.title}</code></span>
    } else {
        return <InvalidState/>
    }

    async function handleBucketListSelected(bucketList) {
        let targetListId = bucketList.id;

        try {
            await backendFetch.post("/bucketlists/" + targetListId + clonePath);
        } catch (e) {
            console.log(e);
            window.alert("Sorry, I can't let you do that, John.")
            return;
        }

        let answer = window.confirm("Do you want to view the modified list?");

        if (answer) {
            history.replace("/bucketlist/" + targetListId + "/");
        } else {
            history.replace("/import/");
            history.goBack();
        }
    }

    return <div>
        <p>In which bucket list do you want to import {description}</p>
        <BucketListProvider>
            {({bucketLists}) => <BucketListSelection bucketLists={bucketLists} onSelect={handleBucketListSelected}/>}
        </BucketListProvider>
    </div>
}

function BucketListSelection({bucketLists, onSelect}) {
    return (
        <div className="collection grey lighten-1">
            { bucketLists.map( bucketList => (
                <div>
                    <a className="collection-item grey lighten-3" onClick={e => onSelect(bucketList)}>
                        {bucketList.title}
                    </a>
                </div>
            ))}
        </div>
    );
}

export default ImportTargetSelection;