// set new item
export const setItem =(key:string, value: string)=>{
    localStorage.setItem(key,value)
}
// get new item
export const getItem =(key:string)=>{
    return localStorage.getItem(key)
}
// remove new item
export const removeItem =(key:string)=>{
    localStorage.removeItem(key)
}