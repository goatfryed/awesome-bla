
const backend = process.env.NODE_ENV === 'production' ?  "https://bucketlist.tost-soft.de/api" : "http://localhost:8080/";
const isDebug = process.env.NODE_ENV !== 'production';


export {
    backend,
    isDebug
}
