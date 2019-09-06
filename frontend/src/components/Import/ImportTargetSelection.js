
import React, {useCallback} from "react";
import {withRouter} from "react-router";
import {backendFetch} from "../../api";
import Authentication from "../../authentication/Authentication";
import {BucketListView} from "../bucketlist/BucketListBoard";

let ImportTargetSelection = withRouter(ImportBase);

function InvalidState({msg = "Nothing to import"}) {
    return <div className="valign-wrapper" style={{minHeight: "70vh"}}>
        <div className="row center-align">{msg}</div>
    </div>
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

    if (!Authentication.isAuthenticated()) {
        return <InvalidState msg="You must be logged in to do that" />
    }

    return <ImportSelection
        user={{userName: Authentication.getUser().sub}}
        remark={remark}
        title={title}
        clonePath={clonePath}
        history={history}
        sourceListId={sourceListId}
    />
}

function ImportSelection({user, remark, title, clonePath, history, sourceListId}) {
    let handleBucketListSelected = useCallback(
        async function (bucketList) {
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
        },
        [remark, title, clonePath, history]
    );

    return <div>
        <p>In which bucket list do you want to import <span>{remark}<code>{title}</code></span></p>
        <BucketListView
            owner={user}
            filter={list => list.id !== sourceListId}
            onListInteraction={handleBucketListSelected}
        />
    </div>
}

export default ImportTargetSelection;