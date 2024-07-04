import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Item } from "./ItemsSlice";

export interface IAuthState {
  user: IUser;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: null | string;
  usernameExists: boolean;
  isAuth: boolean;
}

const initialState: IAuthState = {
  user: {
    userName: "",
    role: "buyer",
    cart: [],
    products: [],
  },
  status: "idle",
  error: null,
  usernameExists: false,
  isAuth: false,
};

export interface ICartItem extends Item {
  quantity: number;
}

export interface IUser {
  userName: null | string;
  role: "seller" | "buyer";
  cart: ICartItem[];
  products: Item[];
}

export const fetchCart = createAsyncThunk(
  "auth/fetchCart",
  async (username: string) => {
    const response = await axios.get(
      `http://localhost:5000/users?username=${username}`
    );
    const user = response.data[0];
    return user.cart;
  }
);

export const addToCart = createAsyncThunk(
  "auth/addToCart",
  async ({ username, itemId }: { username: null | string; itemId: string }) => {
    const userResponse = await axios.get(
      `http://localhost:5000/users?username=${username}`
    );
    const user = userResponse.data[0];
    const itemResponse = await axios.get(
      `http://localhost:5000/items/${itemId}`
    );
    const item = itemResponse.data;
    const itemExist = user.cart.find((el: Item) => el.id === item.id);
    if (!itemExist) {
      const updatedCart = [...user.cart, { ...item, quantity: 1 }];
      const updatedUser = { ...user, cart: updatedCart };

      await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser);
    }
    return { username, itemId, item, itemExist };
  }
);

export const deleteItemCart = createAsyncThunk(
  "auth/deleteItemCart",
  async ({ username, itemId }: { username: string; itemId: string }) => {
    const response = await axios.get(
      `http://localhost:5000/users?username=${username}`
    );
    const user = response.data[0];
    const updatedCart = user.cart.filter((item: any) => item.id !== itemId);
    const updatedUser = {
      ...user,
      cart: updatedCart,
    };
    await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser);
    return { itemId, username, user };
  }
);

export const incrementCartItem = createAsyncThunk(
  "auth/incrementCartItem",
  async ({ username, itemId }: { username: string; itemId: string }) => {
    const response = await axios.get(
      `http://localhost:5000/users?username=${username}`
    );
    const user = response.data[0];
    const updatedCart = user.cart.map((item: any) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    const updatedUser = {
      ...user,
      cart: updatedCart,
    };
    await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser);
    return { username, itemId, user };
  }
);

export const decrementCartItem = createAsyncThunk(
  "auth/decrementCartItem",
  async ({ username, itemId }: { username: string; itemId: string }) => {
    const response = await axios.get(
      `http://localhost:5000/users?username=${username}`
    );
    const user = response.data[0];
    const updatedCart = user.cart.map((item: any) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    const updatedUser = {
      ...user,
      cart: updatedCart,
    };
    await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser);
    return { username, itemId, user };
  }
);

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
      cart: [],
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
      localStorage.setItem("user", JSON.stringify(user));
      if (!user) {
        throw new Error("Password incorrect");
      }
      return user;
    } catch (error) {
      throw new Error("Failed to log in");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {
        userName: "",
        role: "buyer",
        cart: [],
        products: [],
      };
      state.isAuth = false;
      state.status = "idle";
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
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { item, itemExist } = action.payload;
        if (item && !itemExist) {
          state.user.cart.push(item);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add to cart";
      })
      .addCase(incrementCartItem.fulfilled, (state, action) => {
        const item = state.user.cart.find(
          (item) => item.id === action.payload.itemId
        );
        if (item) {
          item.quantity = (item.quantity) + 1;
        }
      })
      .addCase(decrementCartItem.fulfilled, (state, action) => {
        const item = state.user.cart.find(
          (item) => item.id === action.payload.itemId
        );
        if (item && item.quantity > 1) {
          item.quantity -= 1;
        }
      })
      .addCase(deleteItemCart.fulfilled, (state, action) => {
        state.user.cart = state.user.cart.filter(
          (item) => item.id !== action.payload.itemId
        );
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.user.cart = action.payload;
      });
  },
});

export const { logout, resetUsernameExists } = authSlice.actions;
export default authSlice.reducer;
