import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const GetAllProduct = () => {
  const user = useSelector((state) => state.user.user);
  const [data, setData] = React.useState([]);
  const [allProduct, setAllProduct] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const response = await axios.get(
          `/api/v1/product/getOwnerProduct/${user?.username}`
        );
        setData(response.data.data);
      } catch (error) {
        console.log("Error while fetching all products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.username) {
      fetchAllProduct();
    }
  }, [user?.username]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`/api/v1/product/getAllProduct`);
      setAllProduct(response.data.product);
    } catch (error) {
      console.log("Error while fetching all products:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?.role === "admin") {
      fetchAllProducts();
    }
  }, []);

  return (
    <div className="w-full flex flex-wrap px-5 cursor-pointer">
      {data.length > 0 ? (
        <Grid container spacing={2}>
          {(loading ? Array.from(new Array(12)) : data).map((item, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box sx={{ width: "100%", marginRight: 0.5, my: 2 }}>
                {item ? (
                  <Link to={`/productDetails/${item?._id}`}>
                    <img
                      style={{
                        width: "100%",
                        height: 132,
                        objectFit: "contain",
                      }}
                      alt={item.title}
                      src={item.productImages[0]}
                    />
                  </Link>
                ) : (
                  <Skeleton variant="rectangular" width="100%" height={132} />
                )}

                {item ? (
                  <div>
                    <Box sx={{ pr: 2 }}>
                      <Typography
                        className="truncate"
                        gutterBottom
                        variant="body1"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        className="truncate"
                        gutterBottom
                        variant="body2"
                      >
                        {item.description}
                      </Typography>
                      <Typography
                        display="block"
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.owner?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        •{" "}
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>
                  </div>
                ) : (
                  <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {(loading ? Array.from(new Array(12)) : allProduct).map(
            (item, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ width: "100%", marginRight: 0.5, my: 2 }}>
                  {item ? (
                    <Link to={`/productDetails/${item?._id}`}>
                      <img
                        style={{
                          width: "100%",
                          height: 132,
                          objectFit: "contain",
                        }}
                        alt={item.title}
                        src={item.productImages[0]}
                      />
                    </Link>
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height={132} />
                  )}

                  {item ? (
                    <div>
                      <Box sx={{ pr: 2 }}>
                        <Typography
                          className="truncate"
                          gutterBottom
                          variant="body1"
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          className="truncate"
                          gutterBottom
                          variant="body2"
                        >
                          {item.description}
                        </Typography>
                        <Typography
                          display="block"
                          variant="caption"
                          color="text.secondary"
                        >
                          {item.owner?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •{" "}
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </Typography>
                      </Box>
                    </div>
                  ) : (
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  )}
                </Box>
              </Grid>
            )
          )}
        </Grid>
      )}
    </div>
  );
};

export default GetAllProduct;
