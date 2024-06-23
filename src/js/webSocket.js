import store from '../store'

export function init(){
    const jwt = sessionStorage.getItem('jwt');
    const ws = new WebSocket('ws://localhost:8080/ws/'+jwt);
    store.state.ws = ws;
}