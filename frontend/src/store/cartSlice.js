import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: [],
  },
  reducers: {
    addcart: (state, action) => {
      state.carts.push(action.payload);
    },
    updatecart: (state, action) => {
      const index = state.carts.findIndex(
        (cart) => cart.id === action.payload.id
      );
      if (index !== -1) {
        state.carts[index] = action.payload;
      }
    },
    deletecart: (state, action) => {
      const index = state.carts.findIndex(
        (cart) => cart.id === action.payload
      );
      if (index !== -1) {
        state.carts.splice(index, 1);
      }
    },
  },
});

export const { setcarts, addcart, updatecart, deletecart } =
cartSlice.actions;
export default cartSlice.reducer;
