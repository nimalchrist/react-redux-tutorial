import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    tasksList: [],
    selectedTask: {},
    isLoading: false,
    error: ''
};

// GET
export const getTasksFromServer = createAsyncThunk(
    "tasks/getTasksFromServer",
    async (_, { rejectWithValue }) => {
        const response = await fetch("http://localhost:8000/tasks");
        if (response.ok) {
            const jsonResponse = await response.json(); 
            return jsonResponse;
        } else {
            return rejectWithValue({ error: "No Tasks Found" });
        }
    }
);

// POST
export const addTaskToServer = createAsyncThunk(
    "tasks/addTaskToServer",
    async (task, { rejectWithValue }) => {
        const response = await fetch("http://localhost:8000/tasks", {
            method: 'POST',
            body: JSON.stringify(task),
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            return rejectWithValue({ error: "No Tasks added" });
        }
    }
);

// PATCH
export const updateTaskToServer = createAsyncThunk(
    "tasks/updateTaskToServer",
    async (task, { rejectWithValue }) => {
        const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
            method: 'PATCH',
            body: JSON.stringify(task),
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            return rejectWithValue({ error: "Task not updated" });
        }
    }
);
// DELETE
export const deleteTaskToServer = createAsyncThunk(
    "tasks/deleteTaskToServer",
    async (task, { rejectWithValue }) => {
        const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
            method: 'DELETE',
            body: JSON.stringify(task),
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            return rejectWithValue({ error: "Task not deleted" });
        }
    }
);

const tasksSlice = createSlice({
    name: "tasksSlice",
    initialState,
    reducers: {
        removeTaskFromList: (state, action) => {
            state.tasksList = state.tasksList.filter((task) => {
                return action.payload.id !== task.id;
            });
        },
        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasksFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.tasksList = action.payload;
            })
            .addCase(getTasksFromServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTasksFromServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
                state.tasksList = [];
            })
            .addCase(addTaskToServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.tasksList.push(action.payload);
            })
            .addCase(addTaskToServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTaskToServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
            })
            .addCase(updateTaskToServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.tasksList = state.tasksList.map((task) => task.id === action.payload.id ? action.payload : task);
            })
            .addCase(updateTaskToServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTaskToServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
            })
            .addCase(deleteTaskToServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
            })
            .addCase(deleteTaskToServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTaskToServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
            });

    }
});

export const { addTaskToList, removeTaskFromList, updateTaskInList, setSelectedTask } = tasksSlice.actions;
export default tasksSlice.reducer;