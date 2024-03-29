import React from "react";

export function Unauthorized401 () {
    let src = "https://www.youtube.com/embed/7qnd-hdmgfk?"
        + (new URLSearchParams({
            autoplay: 1,
            loop: 0,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            iv_load_policy: 3,
        })).toString()

    return <div
        className="valign-wrapper"
        style={{
            "min-height": "70vh"
        }}
    >
        <div className="row center-align">
            <div className="row">
                <h5>You don't have permission to do that! Go somewhere else!</h5>
            </div>
            <div className="row">
                <iframe
                    title="I'm afraid you can't do that, Dave"
                    style={{
                        margin: "0 auto"
                    }}
                    src={src}
                    width="640" height="360"
                />
            </div>
        </div>
    </div>
}