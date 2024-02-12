import { createStore } from 'easy-peasy';
import storeModel from './model';
import injections from './injections';

const store = createStore(storeModel, {
    injections,
});

export default store;
