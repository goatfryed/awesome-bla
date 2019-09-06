
const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
const isDebug = process.env.NODE_ENV !== 'production';


export {
    backend,
    isDebug
}
