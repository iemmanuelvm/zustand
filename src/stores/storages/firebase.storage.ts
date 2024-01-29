import { StateStorage, createJSONStorage } from "zustand/middleware";



const fireBaseUrl = 'https://zustand-storage-b6d68-default-rtdb.firebaseio.com/zustand';


const storageApi: StateStorage = {
    getItem: async function (name: string): Promise<string | null> {
        try {
            const data = await fetch(`${fireBaseUrl}/${name}.json`).then(res => res.json());
            console.log(data);
            return JSON.stringify(data);
        } catch (error) {
            throw error;
        }
    },
    setItem: async function (name: string, value: string): Promise<void> {
        // const data = 
        await fetch(`${fireBaseUrl}/${name}.json`, {
            method: 'PUT',
            body: value
        }).then(res => res.json());
        // console.log('setItem', name, value);
        // sessionStorage.setItem(name, value);
        // console.log(data);
        // console.count('setItem');
        return;
    },
    removeItem: function (name: string): void | Promise<void> {
        console.log('removeItem', name);
    }
}

export const firebaseStorage = createJSONStorage(() => storageApi);