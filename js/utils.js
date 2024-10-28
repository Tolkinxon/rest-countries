let setItem = (key, val) => window.localStorage.setItem(key, typeof val == "object" ? JSON.stringify(val) : val);
let getItem = (key) => window.localStorage.getItem(key);