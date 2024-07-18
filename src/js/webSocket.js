import store from '../store'


export function init(){
    const jwt = sessionStorage.getItem('jwt');
    // const url = 'ws://8.130.104.205:8080/ws/' + jwt;
    const url = 'ws://localhost:8080/ws/' + jwt;
    console.log(url);
    const ws = new WebSocket(url);
    ws.onopen = () => console.log('WebSocket connection opened');
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket connection closed');
    store.state.ws = ws;
}