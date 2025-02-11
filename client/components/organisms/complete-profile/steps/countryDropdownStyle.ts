import { CSSObjectWithLabel, OptionProps, StylesConfig } from "react-select";
import countries from "world-countries";

type CountryOption = {
  value: string;
  label: string;
};

export const countryOptions: CountryOption[] = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}));

export const customCountryStyles: StylesConfig<CountryOption, false> = {
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    borderColor: "#E8CFD6",
    height: 45,
    boxShadow: "none",
    backgroundColor: "transparent",
    "&:hover": {
      borderColor: "transparent",
    },
  }),
  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  option: (
    provided: CSSObjectWithLabel,
    state: OptionProps<CountryOption, false>,
  ) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#C87188" : "#fff",
    color: state.isFocused ? "#FFFFFF" : "#994D66",
  }),
};
