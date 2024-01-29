import { v4 as uuidV4 } from 'uuid';
import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../../interfaces";

import { immer } from 'zustand/middleware/immer';


interface TaskState {

    draggingTaskId?: string;

    tasks: Record<string, Task>, // { [key: string]: Task }

    getTaskByStatus: (status: TaskStatus) => Task[];

    setDraggingTaskId: (taskId: string) => void;
    removeDraggingTaskId: () => void;
    changeTaskStatus: (taskId: string, status: TaskStatus) => void;
    onTaskDrop: (status: TaskStatus) => void;

    addTask: (title: string, status: TaskStatus) => void;
}

const storeApi: StateCreator<TaskState, [["zustand/immer", never]]> = (set, get) => ({
    draggingTaskId: undefined,
    tasks: {
        'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'open' },
        'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'in-progress' },
        'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'open' },
        'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'open' },
    },

    getTaskByStatus: (status: TaskStatus) => {
        return Object.values(get().tasks).filter(task => task.status === status);
    },

    setDraggingTaskId: (taskId: string) => {
        set({ draggingTaskId: taskId })
    },

    removeDraggingTaskId: () => {
        set({ draggingTaskId: undefined });
    },
    changeTaskStatus: (taskId: string, status: TaskStatus) => {
        // const task = get().tasks[taskId];
        // task.status = status;
        set(state => {
            state.tasks[taskId] = {
                ...state.tasks[taskId],
                status,
            };
        })
        // set((state) => ({
        //     tasks: {
        //         ...state.tasks,
        //         [taskId]: task,
        //     }
        // }))
    },
    onTaskDrop: (status: TaskStatus) => {
        const taksId = get().draggingTaskId;
        if (!taksId) return;

        get().changeTaskStatus(taksId, status);
        get().removeDraggingTaskId();
    },
    addTask: (title: string, status: TaskStatus) => {

        const newTask = { id: uuidV4(), title, status }

        set(state => {
            state.tasks[newTask.id] = newTask;
        });


        // ? Requiere npm i immer
        // set(produce((state: TaskState) => {
        //     state.tasks[newTask.id] = newTask;
        // }))

        // ? Forma natica zustand
        // set( state => ({
        //     tasks: {
        //         ...state.tasks,
        //         [newTask.id]: newTask
        //     }
        // }))
    }
})

export const useTaskStore = create<TaskState>()(
    devtools(
        persist(
            immer(
                storeApi
            ),
            { name: 'task-store' }
        )
    )
)