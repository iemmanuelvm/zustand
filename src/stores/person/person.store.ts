import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { firebaseStorage } from "../storages/firebase.storage";
import { useWeddingBoundStore } from "../wedding";

interface PersonState {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
}

const storeApi: StateCreator<PersonState & Actions, [["zustand/devtools", never]]> = (set) => ({
    firstName: '',
    lastName: '',
    setFirstName: (value: string) => set(({ firstName: value }), false, 'setFirstName'),
    setLastName: (value: string) => set(({ lastName: value }), false, 'setLastName'),
});




export const usePersonStore = create<PersonState & Actions>()(
    // This mehtod helps to persist the data when is reload the browser
    // this method store the data in Local Storage
    // logger(
    // devtools(
        persist(
            storeApi,
            {
                name: 'person-storage',
                // storage: customSessionStorage,
                storage: firebaseStorage,
            }
        )
    // )
    // )
);

usePersonStore.subscribe((nextState, prevState) => {
    // console.log({nextState, prevState});
    const {firstName, lastName} = nextState;
    useWeddingBoundStore.getState().setFirstName(firstName);
    useWeddingBoundStore.getState().setLastName(lastName);
});