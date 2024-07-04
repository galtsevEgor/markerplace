import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Review {
  id: string;
  user: null | string;
  comment: string;
  rating: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  author: string;
  reviews: Review[];
}

interface ItemsState {
  items: Item[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchItems = createAsyncThunk("items/fetchItems", async () => {
  const response = await axios.get("http://localhost:5000/items");
  return response.data;
});

export const addReview = createAsyncThunk(
  "items/addReview",
  async ({ itemId, review }: { itemId: string; review: Review }) => {
    const response = await axios.get(`http://localhost:5000/items/${itemId}`);
    const updatedItem = {
      ...response.data,
      reviews: [...response.data.reviews, review],
    };
    await axios.put(`http://localhost:5000/items/${itemId}`, updatedItem);
    return { itemId, review };
  }
);

export const deleteReview = createAsyncThunk(
  "items/deleteReview",
  async ({ itemId, reviewId }: { itemId: string; reviewId: string }) => {
    const response = await axios.get(`http://localhost:5000/items/${itemId}`);
    const updatedItem = {
      ...response.data,
      reviews: response.data.reviews.filter((review: Review) => review.id !== reviewId),
    };
    await axios.put(`http://localhost:5000/items/${itemId}`, updatedItem);
    return { itemId, reviewId };
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Could not fetch products";
      })
      .addCase(addReview.fulfilled, (state, action) => {
        const { itemId, review } = action.payload;
        const existingItem = state.items.find((item) => item.id === itemId);
        if (existingItem) {
          existingItem.reviews.push(review);
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const { itemId, reviewId } = action.payload;
        const existingItem = state.items.find((item) => item.id === itemId);
        if (existingItem) {
          existingItem.reviews = existingItem.reviews.filter((review) => review.id !== reviewId);
        }
      });
  },
});

export default itemsSlice.reducer;


