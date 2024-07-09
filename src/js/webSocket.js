import store from '../store'

// export function init(){
//     const jwt = sessionStorage.getItem('jwt');
//     const ws = new WebSocket('ws://localhost:8080/ws/'+jwt);
//     store.state.ws = ws;
// }

export function init(){
    const jwt = sessionStorage.getItem('jwt');
    const ws = new WebSocket('ws://localhost:8086/ws/' + jwt);
    ws.onopen = () => console.log('WebSocket connection opened');
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket connection closed');
    store.state.ws = ws;
}