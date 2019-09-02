import React from "react";

export function Unauthorized405 () {
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
                <h5>You were not supposed to that! Stop it!</h5>
            </div>
            <div className="row">
                <iframe
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