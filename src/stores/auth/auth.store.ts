import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthStatus, User } from "../../interfaces";
import { AuthService } from "../../services/auth.service";


export interface AuthState {
    status: AuthStatus;
    // en un punto determinado del tiempo no tendre el token ni el usuario por lo que se pone ? de opcionales
    token?: string;
    user?: User;

    loginUser: (email: string, password: string) => Promise<void>;
    checkStatus: () => Promise<void>;
    logoutUser: () => void;
}

const storeApi: StateCreator<AuthState> = (set) => ({
    status: 'pending',
    token: undefined,
    user: undefined,

    loginUser: async (email: string, password: string) => {
        try {
            const { token, ...user } = await AuthService.login(email, password);
            set({ status: 'authorized', token, user });
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined })
            throw 'Unauthorized';
        }
    },
    checkStatus: async () => {
        try {
            const { token, ...user } = await AuthService.checkStatus();
            set({ status: 'authorized', token, user })
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined })
        }
    },
    logoutUser: () => {
        set({ status: 'unauthorized', token: undefined, user: undefined })
    }
})

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeApi,
            { name: 'auth-storage' }
        )
    )
)