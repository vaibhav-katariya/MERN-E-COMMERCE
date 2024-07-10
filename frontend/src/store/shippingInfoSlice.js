import { createSlice } from "@reduxjs/toolkit";

const shippingInfo = createSlice({
  name: "shippingInfo",
  initialState: {
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
      phoneNo: "",
    },
  },
  reducers: {
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
  },
});
export const { setShippingInfo } = shippingInfo.actions;
export default shippingInfo.reducer;
