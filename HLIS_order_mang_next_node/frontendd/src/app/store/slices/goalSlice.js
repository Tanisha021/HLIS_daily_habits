import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { secureAxios } from "@/app/utilities/secureFetch";


export const addHabitType = createAsyncThunk('habit/addHabitType', async ({name,token}) => {
    // console.log("idd",id)
    console.log("token1",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/add-habit-type`;
    const data = {
       name : name
    }
    const response = await secureAxios(url,data,'POST',api_key,token)
    console.log("response",response)
    return response

});


export const getHabitTypes = createAsyncThunk('habit/getHabitTypes', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/get-habits-type";

    const response = await secureAxios(url, {}, 'GET', api_key, token);
    console.log("response",response)
    return response
});
export const getLogs = createAsyncThunk('habit/getLogs', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/get-logs";

    const response = await secureAxios(url, {}, 'GET', api_key, token);
    console.log("response",response)
    return response
});
export const getStreaks = createAsyncThunk('habit/getStreaks', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/get-habit-streaks";

    const response = await secureAxios(url, {}, 'GET', api_key, token);
    console.log("response",response)
    return response
});
export const getSuggestedHabits = createAsyncThunk('habit/getSuggestedHabits', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/get-suggested-habits";

    const response = await secureAxios(url, {}, 'GET', api_key, token);
    console.log("response",response)
    return response
});

export const createHabit = createAsyncThunk('habit/createHabit', async (request_data) => {
    const {token, name,habit_type_id,goal_type,goal_target,reminder_time,message} = request_data;
    console.log("requated",request_data)
    const send_data = {
        name,habit_type_id,goal_type,goal_target,reminder_time,message
    }
    console.log("here");
    console.log("send data: ",send_data);
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/create-habit`;
    const response = await secureAxios(url,send_data,'POST',api_key,token)
    console.log("response",response)
    return response
});
export const logHabit = createAsyncThunk('habit/logHabit', async (request_data) => {
    const {token, habit_id,status,date } = request_data;
    console.log("requated",request_data)
    const send_data = {
        habit_id,status,date 
    }
    console.log("here");
    console.log("send data: ",send_data);
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/log-habit`;
    const response = await secureAxios(url,send_data,'POST',api_key,token)
    console.log("response",response)
    return response
});

const initialState = {

    loading: false,
    error: null,
    habit_type:null,
    allHabitType:null,
    createdHabit:null,
    updateLog:null,
    allLogs:null,
    streaks:null,
    suggestedHabits:null,

};

const goalSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(addHabitType.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(addHabitType.fulfilled, (state, action) => {
                state.loading = false;
                state.habit_type = action.payload.data;
                console.log("products==",action.payload.data)
            })
            .addCase(addHabitType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })
            .addCase(getHabitTypes.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(getHabitTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.allHabitType = action.payload.data;
                console.log("habits==",action.payload.data)
            })
            .addCase(getHabitTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })
            .addCase(createHabit.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(createHabit.fulfilled, (state, action) => {
                state.loading = false;
                state.createdHabit = action.payload.data;
                
                console.log("createdHabits==",action.payload.data)
            })
            .addCase(createHabit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })
            .addCase(logHabit.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(logHabit.fulfilled, (state, action) => {
                state.loading = false;
                state.updateLog = action.payload.data;
                
                console.log("updateLog==",action.payload.data)
            })
            .addCase(logHabit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })
            .addCase(getLogs.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(getLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.allLogs = action.payload.data;
                
                console.log("allLogs==",action.payload.data)
            })
            .addCase(getLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })
            .addCase(getStreaks.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(getStreaks.fulfilled, (state, action) => {
                state.loading = false;
                state.streaks = action.payload.data;
                
                console.log("streaks==",action.payload.data)
            })
            .addCase(getStreaks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })
            .addCase(getSuggestedHabits.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(getSuggestedHabits.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestedHabits = action.payload.data;
                
                console.log("suggestedHabits==",action.payload.data)
            })
            .addCase(getSuggestedHabits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })





    }
});

export default goalSlice.reducer;
