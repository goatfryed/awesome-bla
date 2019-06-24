import React, {useEffect, useState} from "react";
import {backendUrl} from "../config";

export function BucketListEntries({match}) {
    let {id} = match.params;

    let [entries, setEntries] = useState(null);
    useEffect(() => {
            (async () => {
                const response = await fetch( backendUrl + "/bucketlists/"+id+"/entries/");
                const json = await response.json();
                setEntries(json);
            })();
        },
        [id]
    );
    return <ul>
            {entries && entries.map( entry => <BucketListEntry key={entry.id} entry={entry}/>)}
    </ul>;
}



function BucketListEntry({entry}) {
    return <li><input type="checkbox" checked={entry.completed} />{entry.title}</li>;
}