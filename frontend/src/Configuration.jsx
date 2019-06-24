import React from "react";

const backend = process.env.NODE_ENV === 'production' ?  "http://tost-soft.de:10031" : "http://localhost:8080";
export default backend;