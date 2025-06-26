import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'http://localhost:5000/api/tasks';

// Helper to get token from localStorage
const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

// 🔄 Thunks

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, thunkAPI) => {
  try {
    const token = getToken();
    const res = await axios.get(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const fetchMyTasks = createAsyncThunk('tasks/fetchMy', async (_, thunkAPI) => {
  try {
    const token = getToken();
    const res = await axios.get(`${API}/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
  try {
    const token = getToken();
    const res = await axios.post(API, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Task created');
    return res.data;
  } catch (err) {
    toast.error('Failed to create task');
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, status }, thunkAPI) => {
  try {
    const token = getToken();
    const res = await axios.put(`${API}/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Task updated');
    return res.data;
  } catch (err) {
    toast.error('Failed to update task');
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
  try {
    const token = getToken();
    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Task deleted');
    return id;
  } catch (err) {
    toast.error('Failed to delete task');
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// 🔧 Slice

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch All or My
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchMyTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyTasks.rejected, (state) => {
        state.loading = false;
      })

      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })

      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  }
});

export default taskSlice.reducer;
