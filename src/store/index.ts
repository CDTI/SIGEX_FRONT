import { createStore, Store, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'
import { UserState } from './ducks/user/types'

import rootReducer from './ducks/rootReducer'

export interface ApplicationState {
    user: UserState
}

const configPersisted = {
    key: '@ext',
    storage
}

const persistedReducer = persistReducer(configPersisted, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const store: Store<ApplicationState> = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);

export { store, persistor }