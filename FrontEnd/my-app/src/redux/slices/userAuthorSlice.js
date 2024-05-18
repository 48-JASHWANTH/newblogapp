//create redux slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//make http request using redux-thunk-middleware
export const userAuthorLoginThunk = createAsyncThunk(
  "user-author-login",
  async (userCredObj, thunkApi) => {
    try {
      if (userCredObj.userType === "user") {
        const res = await axios.post(
          "http://localhost:4000/userApi/login",
          userCredObj
        );
        if (res.data.message === "Login successful!") {
          //store token in local storage/session storage
          localStorage.setItem("token", res.data.payload);
        } else {
          return thunkApi.rejectWithValue(res.data.message);
        }
        //return data
        return res.data;
      }
      if (userCredObj.userType === "author") {
        const res = await axios.post(
          "http://localhost:4000/authorApi/login",
          userCredObj
        );
        if (res.data.message === "Login successful!") {
          //store token in local storage/session storage
          localStorage.setItem("token", res.data.payload);
        } else {
          return thunkApi.rejectWithValue(res.data.message);
        }
        //return data
        return res.data;
      }
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const userAuthorSlice = createSlice({
  name: "userAuthorLogin",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: {},
    errorOccurred: false,
    errorMessage: "",
  },
  reducers: {
    resetState: (state, action) => {
      state.isPending = false;
      state.loginUserStatus = false;
      state.currentUser = {};
      state.errorOccurred = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(userAuthorLoginThunk.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.loginUserStatus = true;
        state.currentUser = action.payload.user;
        state.errorOccurred = false;
        state.errorMessage = "";
      })
      .addCase(userAuthorLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.loginUserStatus = false;
        state.currentUser = {};
        state.errorOccurred = true;
        state.errorMessage = action.payload;
      }),
});

//export action creator functions
export const { resetState } = userAuthorSlice.actions;

//export root reducer of this slice
export default userAuthorSlice.reducer;
