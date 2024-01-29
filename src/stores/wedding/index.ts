import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ConfirmationSlice, createConfirmationSlice } from './confirmation.slice';
import { DateSlice, createDateSlice } from './data.slice';
import { GuestSlice, createGuestSlice } from './guest.slice';
import { PersonSlice, createPersonSlice } from './person.slice';

// crear el store
type ShareState = PersonSlice & GuestSlice & DateSlice & ConfirmationSlice;


export const useWeddingBoundStore = create<ShareState>()(
    devtools(
        (...a) => ({
            ...createPersonSlice(...a),
            ...createGuestSlice(...a),
            ...createDateSlice(...a),
            ...createConfirmationSlice(...a),
        }
        )
    )
)