import { useState, useEffect } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CitySelect from "./CitySelect";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import _ from "lodash";
import { getHaversineDistance } from "../utils/helpers";

console.log(getHaversineDistance(["city1", 0, 0], ["city2", 50, 50]));
console.log(getHaversineDistance(["city1", 0, 0], ["city2", 100, 100]));
console.log(getHaversineDistance(["city1", 0, 0], ["city2", 150, 150]));
console.log(getHaversineDistance(["city1", 0, 0], ["city2", 200, 200]));

type FormInterface = {
  cityOrigin: string;
  cityIntermediates: string[];
  cityDestination: string;
  tripDate: string;
  passengersCount: number;
};

const formSchema = Yup.object().shape({
  cityOrigin: Yup.string().required("Origin City is required"),
  cityIntermediates: Yup.array().of(
    Yup.string().required("Intermediate Cities are required")
  ),
  cityDestination: Yup.string().required("Destination City is required"),
  tripDate: Yup.string().required("Trip Date is required"),
  passengersCount: Yup.number()
    .required("Number of passengers is required")
    .min(1),
});

const emptyFormValues: FormInterface = {
  cityOrigin: "",
  cityIntermediates: [],
  cityDestination: "",
  tripDate: "",
  passengersCount: 0,
};

// ========== || START STYLED COMPONENTS || ========== //
const StyledFormField = styled(Box)`
  margin-bottom: 30px;
  display: flex;
  flex: 1 1 0;
  align-items: stretch;
`;
// ========== || END STYLED COMPONENTS || ========== //

interface SearchFormProps {
  readOnly: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ readOnly = false }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialValues, setInitialValues] =
    useState<FormInterface>(emptyFormValues);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: (values) => {
      navigate({
        pathname: "/result",
        search: `?${getSearchParams().toString()}`,
      });
    },
  });

  const { values, touched, errors, setFieldValue, handleSubmit } = formik;

  const setIntermediateValue = (value: string, index: number) => {
    const oldValues = [...values.cityIntermediates];
    oldValues[index] = value;
    setFieldValue("cityIntermediates", oldValues);
  };

  const addIntermediateCity = () => {
    setFieldValue("cityIntermediates", [...values.cityIntermediates, ""]);
  };

  const deleteIntermediateCity = (index: number) => {
    const oldValues = [...values.cityIntermediates];
    oldValues.splice(index, 1);
    setFieldValue("cityIntermediates", oldValues);
  };

  const getSearchParams = () => {
    const searchParamsObj: { [key: string]: string } = {};
    for (const fieldName in values) {
      searchParamsObj[fieldName] = JSON.stringify((values as any)[fieldName]);
    }

    return createSearchParams(searchParamsObj);
  };

  useEffect(() => {
    setSearchParams(getSearchParams());
  }, [values]);

  useEffect(() => {
    const queryValues = {
      cityOrigin: JSON.parse(searchParams.get("cityOrigin") || '""'),
      cityIntermediates: JSON.parse(
        searchParams.get("cityIntermediates") || "[]"
      ),
      cityDestination: JSON.parse(searchParams.get("cityDestination") || '""'),
      tripDate: JSON.parse(searchParams.get("tripDate") || '""'),
      passengersCount: JSON.parse(searchParams.get("passengersCount") || "0"),
    };
    setInitialValues(queryValues);
  }, []);
  console.log(">>>>>>>", values);
  return (
    <Box component="form" onSubmit={handleSubmit} id="city-search-form">
      <StyledFormField>
        <CitySelect
          defaultValue={values.cityOrigin}
          name="cityOrigin"
          label="City of origin"
          disabled={readOnly}
          onChange={(val) => setFieldValue("cityOrigin", val)}
          onBlur={formik.handleBlur}
          error={Boolean(touched.cityOrigin && errors.cityOrigin)}
        />
      </StyledFormField>

      {values.cityIntermediates.map((city, index) => (
        <StyledFormField key={index}>
          <CitySelect
            defaultValue={city}
            name="cityIntermediates"
            label="Intermediate City"
            disabled={readOnly}
            onChange={(val) => setIntermediateValue(val, index)}
            onBlur={formik.handleBlur}
            error={Boolean(
              touched.cityIntermediates && errors.cityIntermediates?.[index]
            )}
          />

          <Box display="flex" alignItems="center">
            <IconButton
              size="large"
              sx={{ marginLeft: "10px" }}
              onClick={() => deleteIntermediateCity(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </StyledFormField>
      ))}

      {!readOnly && (
        <StyledFormField>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<AddIcon />}
            className="!normal-case !mt-2"
            onClick={addIntermediateCity}
          >
            Add Intermediate City
          </Button>
        </StyledFormField>
      )}

      <StyledFormField>
        <CitySelect
          defaultValue={values.cityDestination}
          name="cityDestination"
          label="City of destination"
          disabled={readOnly}
          onChange={(val) => setFieldValue("cityDestination", val)}
          onBlur={formik.handleBlur}
          error={Boolean(touched.cityDestination && errors.cityDestination)}
        />
      </StyledFormField>

      <StyledFormField>
        <DesktopDatePicker
          label="Date of trip"
          inputFormat="MM/DD/YYYY"
          value={values.tripDate}
          disablePast
          onChange={(val: any) => {
            setFieldValue("tripDate", moment(val).format("MM/DD/YYYY"));
          }}
          disabled={readOnly}
          renderInput={(params) => (
            <TextField
              {...params}
              error={Boolean(touched.tripDate && errors.tripDate)}
              sx={{ width: "100%" }}
              onBlur={formik.handleBlur}
              name="tripDate"
              disabled={readOnly}
              required
            />
          )}
        />

        <TextField
          id="passengersCount"
          name="passengersCount"
          label="Passengers"
          type="number"
          value={values.passengersCount}
          onChange={(e) => setFieldValue("passengersCount", e.target.value)}
          onBlur={formik.handleBlur}
          error={Boolean(touched.passengersCount && errors.passengersCount)}
          className="grow"
          required
          disabled={readOnly}
          sx={{ marginLeft: "10px" }}
        />
      </StyledFormField>

      {!readOnly && (
        <StyledFormField>
          <Button
            size="large"
            variant="contained"
            fullWidth
            type="submit"
            startIcon={<SearchIcon />}
            disabled={!(Boolean(values.cityOrigin) && _.isEmpty(errors))}
          >
            Search
          </Button>
        </StyledFormField>
      )}
    </Box>
  );
};

export default SearchForm;
