
import React from "react";
import {withRouter} from "react-router";
import {backendFetch} from "../../api";

let ImportTargetSelection = withRouter(ImportBase);

function InvalidState() {
    return <span>Nothing to import</span>;
}

function ImportBase({location, history}) {

    if (!location.state) {
        return <InvalidState/>
    }
    let clonePath;
    let title;
    let remark = "";
    let sourceListId;

    if (location.state.entry) {

        let entry = location.state.entry;
        clonePath = "/entries/cloneEntry/" + entry.id + "/";
        sourceListId = entry.bucketList;
        title = entry.title;

    } else if (location.state.bucketList) {

        let bucketList = location.state.bucketList;
        clonePath = "/entries/cloneList/" + bucketList.id + "/";
        sourceListId = bucketList.id;
        title = bucketList.title;
        remark = "ALL entries of ";

    } else {
        return <InvalidState/>
    }

    async function handleBucketListSelected(bucketList) {
        let targetListId = bucketList.id;

        if (!window.confirm("Are you sure you want to import \"" + remark + title + "\" into \"" + bucketList.title + "\"")) {
            return;
        }

        try {
            await backendFetch.post("/bucketlists/" + targetListId + clonePath);
        } catch (e) {
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
        <p>In which bucket list do you want to import <span>{remark}<code>{title}</code></span></p>
        <BucketListProvider filter={list => list.id !== sourceListId }>
            {({bucketLists}) => <BucketListSelection bucketLists={bucketLists} onSelect={handleBucketListSelected}/>}
        </BucketListProvider>
    </div>
}

function BucketListSelection({bucketLists, onSelect}) {
    return (
        <div className="collection grey lighten-1">
            { bucketLists
                .map( bucketList => (
                <div key={bucketList.id}>
                    <a className="collection-item grey lighten-3" onClick={e => onSelect(bucketList)}>
                        {bucketList.title}
                    </a>
                </div>
            ))}
        </div>
    );
}

export default ImportTargetSelection;