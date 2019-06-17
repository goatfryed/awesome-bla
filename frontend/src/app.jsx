
import * as React from "react";
import {render} from "react-dom";

function App() {
    return <span>What do you want to do before you die?</span>;
}

window.addEventListener(
    "DOMContentLoaded",
    function () {
        render(
            <App />,
            document.getElementById("app")
        )
    }
)