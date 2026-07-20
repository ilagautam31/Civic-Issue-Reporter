import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReports as fetchReportsApi } from "../api/reportApi.js";

export const loadReports = createAsyncThunk(
  "reports/loadReports",
  async (filters, { rejectWithValue }) => {
    try {
      const res = await fetchReportsApi(filters);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load reports");
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;
