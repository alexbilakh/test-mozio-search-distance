import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import SearchForm from "../components/SearchForm";
import { CityDistance } from "../@types";

// ========== || START STYLED COMPONENTS || ========== //
const StyledContainer = styled(Box)`
  width: 100%;
  margin: 0 auto;
  margin-top: 50px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: 600px;

  @media (min-width: 1280px) {
    flex-direction: row;
    max-width: 1200px;
    justify-content: space-around;
  }
`;
const StyledCityBox = styled(Box)`
  padding: 12px;
  width: 220px;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
  background-color: #757575;
  text-align: center;
  font-size: 21px;
  color: white;
  font-family: cursive;
`;
const StyledDistanceBox = styled(Box)`
  font-size: 19px;
  font-family: monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50px;
  height: 71px;
  justify-content: space-between;
`;
// ========== || END STYLED COMPONENTS || ========== //

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [distances, setDistances] = useState<{
    subDistances: CityDistance[];
    totalDistance: number;
  }>({
    subDistances: [],
    totalDistance: 0,
  });
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await axios
          .get(`/api/distances${location.search}`)
          .then((res) => res.data);
        setDistances(response);
        setError(false);
      } catch (error) {
        setError(true);
        console.log(error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <StyledContainer>
      <Box>
        <SearchForm readOnly />

        <Button
          variant="outlined"
          size="medium"
          startIcon={<ArrowBackIcon />}
          className="!normal-case !mt-2"
          onClick={() => navigate("/")}
        >
          Back to Home page
        </Button>
      </Box>

      <Box>
        <Box sx={{ textAlign: "center" }}>
          {loading && <CircularProgress color="inherit" size={40} />}

          {!loading && !error && (
            <Typography variant="h4" sx={{ marginBottom: "10px" }}>
              Total: {distances.totalDistance} Km
            </Typography>
          )}
        </Box>

        {!loading &&
          !error &&
          distances.subDistances.map((subDistance, index) => {
            const isDestination =
              index === distances.subDistances.length - 1 && index !== 0;
            return (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                flexDirection="column"
              >
                <StyledCityBox>{subDistance[0]}</StyledCityBox>

                <StyledDistanceBox>
                  <ArrowDropDownIcon
                    fontSize="large"
                    sx={{ marginTop: "-10px" }}
                  />
                  {subDistance[2]} km
                  <ArrowDropUpIcon
                    fontSize="large"
                    sx={{ marginBottom: "-10px" }}
                  />
                </StyledDistanceBox>

                {isDestination && (
                  <StyledCityBox>{subDistance[1]}</StyledCityBox>
                )}
              </Box>
            );
          })}
      </Box>

      {error && !loading && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          An error occurred while fetching the distances. Please try again
          later.
        </Alert>
      )}
    </StyledContainer>
  );
};

export default Result;
