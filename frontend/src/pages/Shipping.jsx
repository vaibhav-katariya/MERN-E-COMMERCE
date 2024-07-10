import React, { useState } from "react";
import { Country, State } from "country-state-city";
import CheckoutSteps from "../components/CheckOutStape";
import PinDropIcon from "@mui/icons-material/PinDrop";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { useDispatch, useSelector } from "react-redux";
import { setShippingInfo } from "../store/shippingInfoSlice";
import { useNavigate } from "react-router";

const Shipping = () => {
  const dispatch = useDispatch();
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo);
  const navigate = useNavigate()

  const [shippingData, setShippingData] = useState({
    address: shippingInfo.address,
    city: shippingInfo.city,
    state: shippingInfo.state,
    country: shippingInfo.country,
    pinCode: shippingInfo.pinCode,
    phoneNo: shippingInfo.phoneNo,
  });

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (shippingData.phoneNo.length < 10 || shippingData.phoneNo.length > 10) {
      alert.error("Phone Number should be 10 digits Long");
      return;
    }
    dispatch(setShippingInfo(shippingData));
    navigate("/confirm-order")
  };

  return (
    <div className="my-5">
      <CheckoutSteps activeStep={0} />

      <div className="flex justify-center items-center p-5">
        <div className="bg-white w-full md:w-3/4 lg:w-1/2 p-8 rounded-lg shadow-lg">
          <h2 className="text-center mb-5 text-2xl text-gray-700">
            Shipping Details
          </h2>

          <form
            className="flex flex-col"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div className="flex items-center mb-4">
              <HomeIcon />
              <input
                type="text"
                placeholder="Address"
                required
                value={shippingData.address}
                onChange={(e) =>
                  setShippingData({ ...shippingData, address: e.target.value })
                }
                className="flex-1 p-2 ml-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center mb-4">
              <LocationCityIcon />
              <input
                type="text"
                placeholder="City"
                required
                value={shippingData.city}
                onChange={(e) =>
                  setShippingData({ ...shippingData, city: e.target.value })
                }
                className="flex-1 p-2 ml-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center mb-4">
              <PinDropIcon />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={shippingData.pinCode}
                onChange={(e) =>
                  setShippingData({ ...shippingData, pinCode: e.target.value })
                }
                className="flex-1 p-2 ml-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center mb-4">
              <PhoneIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={shippingData.phoneNo}
                onChange={(e) =>
                  setShippingData({ ...shippingData, phoneNo: e.target.value })
                }
                size="10"
                className="flex-1 p-2 ml-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center mb-4">
              <PublicIcon />
              <select
                required
                value={shippingData.country}
                onChange={(e) =>
                  setShippingData({ ...shippingData, country: e.target.value })
                }
                className="flex-1 p-2 ml-2 border border-gray-300 rounded"
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {shippingData.country && (
              <div className="flex items-center mb-4">
                <TransferWithinAStationIcon />
                <select
                  required
                  value={shippingData.state}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, state: e.target.value })
                  }
                  className="w-[100%] p-2 ml-2 border border-gray-300 rounded"
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(shippingData.country).map(
                      (item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      )
                    )}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="bg-zinc-700 rounded-md text-white p-2 cursor-pointer disabled:bg-zinc-300"
              disabled={shippingData.state ? false : true}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
