import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import _ from "lodash";

interface CitySelectProps {
  defaultValue?: string | null;
  name: string;
  label: string;
  disabled: boolean;
  onChange: (val: string) => void;
  onBlur: (e: React.FocusEvent<any, Element>) => void;
  error?: boolean;
}

const CitySelect: React.FC<CitySelectProps> = ({
  name,
  label = "",
  onChange = () => {},
  onBlur,
  defaultValue = "",
  disabled = false,
  error = false,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<string>>([]);
  const [value, setValue] = useState<string>(defaultValue || "");
  const [serverError, setServerError] = useState<boolean>(false);

  const loadCities = _.debounce(async (value) => {
    if (value === "") {
      setOptions([]);
      return;
    }
    if (options.includes(value)) return;

    setLoading(true);
    try {
      const response = await axios
        .get(`/api/cities?search=${value}`)
        .then((res) => res.data);
      setOptions(response);
      setServerError(false);
    } catch (err) {
      setServerError(true);
      console.log(err);
    }
    setLoading(false);
  }, 300);

  const onInputChange = async (e: React.SyntheticEvent, value: string) => {
    loadCities(value);
  };

  const onValueChange = (
    e: React.SyntheticEvent<Element, Event>,
    val: string | null
  ) => {
    setValue(val as string);
    onChange(val as string);
  };

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  return (
    <Autocomplete
      defaultValue={defaultValue}
      id={name}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      loading={loading}
      onInputChange={onInputChange}
      value={value}
      onChange={onValueChange}
      disabled={disabled}
      sx={{ width: "100%" }}
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          error={error || serverError}
          helperText={
            serverError ? "An error occurred while fetching city list." : ""
          }
          required
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default CitySelect;
