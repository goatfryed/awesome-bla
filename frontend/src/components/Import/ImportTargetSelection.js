
import React from "react";
import {withRouter} from "react-router";

let ImportTargetSelection = withRouter(ImportBase);

function ImportBase(props) {
    console.log(props);

    return <pre>{JSON.stringify(props, null, 4)}</pre>
}

export default ImportTargetSelection;