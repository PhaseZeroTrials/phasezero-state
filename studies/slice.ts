import { Action, Thunk, action, thunk } from 'easy-peasy';
import studyService, { IStudy } from './api';

interface StudySlice {
    // State
    items: Array<IStudy>;
    selected: IStudy | undefined;
    isStudyLoading: boolean;

    // Reducers
    setItems: Action<StudySlice, Array<IStudy>>;
    setSelected: Action<StudySlice, IStudy>;
    delete: Action<StudySlice, IStudy>;
    setIsStudyLoading: Action<StudySlice, boolean>;

    // Actions
    getStudies: Thunk<StudySlice>;
    getStudy: Thunk<StudySlice, number>;
    deleteStudy: Thunk<StudySlice, any>;
}

const studySlice: StudySlice = {
    // States
    items: [],
    selected: undefined,
    isStudyLoading: false,

    // Reducers
    setItems: action((state, payload) => {
        state.items = payload;
    }),

    setSelected: action((state, payload) => {
        state.selected = payload;
    }),

    delete: action((state, payload) => {
        state.items = state.items.filter((item) => item.id !== payload.id);
    }),

    setIsStudyLoading: action((state, payload) => {
        state.isStudyLoading = payload;
    }),

    // Thunk Actions
    getStudies: thunk(async (actions) => {
        actions.setIsStudyLoading(true);
        await studyService
            .getStudies()
            .then((data) => {
                actions.setItems(data);
            })
            .catch();
        actions.setIsStudyLoading(false);
    }),

    getStudy: thunk(async (actions, id) => {
        actions.setIsStudyLoading(true);
        await studyService
            .getStudy(id)
            .then((data) => {
                actions.setSelected(data);
            })
            .catch((err) => {
                return new Promise(err);
            });
        actions.setIsStudyLoading(false);
    }),

    deleteStudy: thunk(async (actions, payload) => {
        await studyService
            .deleteStudy(payload)
            .then(() => {
                actions.delete(payload);
            })
            .catch((err) => {
                return new Promise(err);
            });
    }),
};

export default studySlice;
