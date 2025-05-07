import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { secureAxios } from "@/app/utilities/secureFetch";


export const adminlogin = createAsyncThunk('auth/adminlogin', async (data, { rejectWithValue }) => {
    try {
        const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
        const url = "http://localhost:3000/v1/admin/login";
        const response = await secureAxios(url, data, 'POST', api_key);
        console.log("response", response)
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const viewAllUsers = createAsyncThunk('auth/viewAllUsers', async (token) => {
    console.log("token1",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/admin/getAllUsers`;
    const data = {}
    const response = await secureAxios(url,data,'GET',api_key,token)
    console.log("response",response)
    return response 

});

export const viewUserDetails = createAsyncThunk('auth/viewUserDetails', async ({id,token}) => {

    console.log("id",id)
    console.log("tokennn-viewDeatl",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/admin/canViewProgress/${id}`;
    const data = {}
    const response = await secureAxios(url,data,'GET',api_key,token)
    console.log("response-view dets",response)
    return response

});


const initialState = {
    admin: null,
    token:null,
    loading: false,
    error: null,
    users: null,
    usersDetail:null
};

const adminSlice = createSlice({
    name: "adminauth",
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder
            
            .addCase(adminlogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminlogin.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.admin = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    console.log("state.admin",state.admin)
                    console.log("state.token",state.token)
                    state.error = null;
                    localStorage.setItem("admin_token", action.payload.data.user_token);
                } else {
                    state.admin = null;
                    state.token = null;
                    state.error = action.payload.message;
                }
            })
            .addCase(adminlogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(viewAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(viewAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(viewAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.users = action.payload.data;
                    state.error = null;
                } else {
                    state.users = null;
                    state.error = action.payload.message;
                }
            })


            .addCase(viewUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(viewUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.usersDetail = action.payload.data;
                    console.log("state.usersDetail",state.usersDetail)
                    console.log("action.payload.data",action.payload.data)
                    state.error = null;
                } else {
                    state.usersDetail = null;
                    state.error = action.payload.message;
                }
            })
            .addCase(viewUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }); 
            


    },
});


export default adminSlice.reducer;
