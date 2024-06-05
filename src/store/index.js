import {createStore} from 'vuex'
const store = createStore({
    state:{
        jwt:''
    },
    mutations: {
        setJwt:(state,jwt) => {
            store.state.jwt = jwt;
        }
    }
})

export default store;