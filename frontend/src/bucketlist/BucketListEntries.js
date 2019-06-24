import React, {useEffect, useState} from "react";
import {backendUrl} from "../config";

export function BucketListEntries() {
    let [entries, setEntries] = useState(null);
    useEffect(() => {
            (async () => {
                const response = await fetch( backendUrl + "/bucketlists/1/entries/");
                const json = await response.json();
                setEntries(json);
            })();
        },
        []
    );
    return <ul>
            {entries && entries.map( entry => <BucketListEntry key={entry.id} entry={entry}/>)}
    </ul>;
}



function BucketListEntry({entry}) {
    return <li><input type="checkbox" checked={entry.completed} />{entry.title}</li>;
}