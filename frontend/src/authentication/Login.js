import React, {useEffect, useState} from "react";
import Authentication from "./Authentication";

export function Login() {

    useEffect(
        () => {
            Authentication.getAuthenticationURL(url => window.location.href = url);
        },
        []
    );

    return <span>Redirecting...</span>
}