import { UserState, UserTypes } from './types'
import { Reducer } from 'redux'

const INITIAL_STATE: UserState = {
    data: { id: 0, name: '', role: '', cpf: '', password: '' }
}

const reducer: Reducer<UserState> = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case UserTypes.ADD_USER:
            return {...state, data: action.payload.data};
        case UserTypes.REMOVE_USER:
            return {...state, data: state};
        case UserTypes.REQUEST_USER:
            return {...state};
        default:
            return state    
    }
}

export default reducer