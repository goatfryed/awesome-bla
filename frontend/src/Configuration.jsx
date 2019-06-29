import React from "react";

const backend = process.env.NODE_ENV === 'production' ?  "https://bucketlsit.tost-soft.de" : "http://localhost:8080";
export default backend;