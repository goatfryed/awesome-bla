import React, {useEffect, useState} from "react";
import {backendUrl} from "../config";

export function BucketListEntries() {
    useEffect(() => {
            (async () => {
                const response = await fetch( backendUrl + "/bucketlists/1/entries/");
                const json = await response.json();
                console.log(json);
            })();
        },
        []
    );
    return <span>Under construction</span>;
}