import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: [],
  },
  reducers: {
    addcart: (state, { payload }) => {
      const isExist = state.carts.find((item) => item._id === payload._id);

      if (isExist) {
        if (isExist.stock > isExist.quantity) {
          isExist.quantity++;
        }
      } else {
        state.carts.push({
          quantity: 1,
          _id: payload._id,
          title: payload.title,
          price: payload.price,
          image: payload.productImages[0],
          stock: payload.stock,
          owner: payload.owner,
          category: payload.category,
        });
      }
    },

    deletecart: (state, action) => {
      state.carts = state.carts.filter((item) => item._id !== action.payload);
    },

    decrease: (state, action) => {
      const cartItem = state.carts.find((item) => item._id === action.payload);
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        state.carts = state.carts.filter((item) => item._id !== action.payload);
      }
    },
  },
});

export const { addcart, deletecart, decrease } = cartSlice.actions;
export default cartSlice.reducer;
