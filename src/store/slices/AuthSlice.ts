import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface AuthState {
  user: User;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: null | string;
  usernameExists: boolean;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: {
    userName: "",
    role: "buyer",
  },
  status: "idle",
  error: null,
  usernameExists: false,
  isAuth: false,
};

export interface User {
  userName: null | string;
  role: "seller" | "buyer";
}

export const checkUsernameExists = createAsyncThunk(
  "auth/checkUsernameExists",
  async (username: string) => {
    const response = await axios.get(
      `http://localhost:5000/users?username=${username}`
    );
    return response.data.length > 0;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({
    username,
    password,
    role,
  }: {
    username: string;
    password: string;
    role: string;
  }) => {
    const response = await axios.post("http://localhost:5000/users", {
      username,
      password,
      role,
    });
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }: { username: string; password: string }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users?username=${username}`
      );
      const users = response.data;
      if (users.length === 0) {
        throw new Error("User not found");
      }
      const user = users.find((u: any) => u.password === password);
      localStorage.setItem('user', JSON.stringify(user));
      if (!user) {
        throw new Error("Password incorrect");
      }
      return user;
    } catch (error) {
      throw new Error("Failed to log in");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      (state.user = {
        userName: "",
        role: "buyer",
      }) 
        && 
      (state.isAuth = false)
        &&
      (state.status = "idle")
    },
    resetUsernameExists: (state) => {
      state.usernameExists = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.userName = action.payload.username;
        state.user.role = action.payload.role;
        state.isAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to register";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.userName = action.payload.username;
        state.user.role = action.payload.role;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to login";
      })
      .addCase(checkUsernameExists.fulfilled, (state, action) => {
        state.usernameExists = action.payload;
      });
  },
});

export const { logout, resetUsernameExists } = authSlice.actions;
export default authSlice.reducer;
