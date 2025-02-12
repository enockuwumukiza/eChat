import { useState, useEffect } from "react";
import { CountryCode, getCountries, getCountryCallingCode, getExampleNumber, Examples } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Controller, useFormContext } from "react-hook-form";

interface PhoneNumberInputProps {
  name: string;
  value: string;
  onChange: (phone: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ name, value, onChange }) => {
  const [countryCode, setCountryCode] = useState<string>("us");

  // Detect user's country
  useEffect(() => {
    const detectCountry = () => {
      try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        const country = locale.split("-")[1]?.toUpperCase(); // Extract country code
        if (country && getCountries().includes(country as CountryCode)) {
          setCountryCode(country.toLowerCase());
        }
      } catch (error) {
        console.error("Error detecting country:", error);
      }
    };

    detectCountry();
  }, []);

  // Get Area Code from Country Code
  const getAreaCode = (code: string) => {
    const areaCode = getCountryCallingCode(code);
    return areaCode ? `+${areaCode}` : "";
  };

  // Example phone number for selected country
  const exampleNumber = getExampleNumber(countryCode.toUpperCase() as CountryCode, {} as Examples);
  const formattedExampleNumber = exampleNumber ? exampleNumber.formatInternational() : "Enter your number";

  return (
    <div className="relative">
      <PhoneInput
        country={countryCode}
        value={value}
        onChange={onChange}
        enableSearch={true}
        containerClass="relative border-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600"
        inputClass="w-[100%] text-black font-medium px-4 py-2 border-none outline-none rounded-lg ring-2 ring-gray-300 focus:ring-blue-500 placeholder:text-gray-500"
        buttonClass="bg-gray-100 border-none rounded-l-lg px-4 py-2"
        dropdownClass="border shadow-lg rounded-lg overflow-hidden"
        searchClass="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={formattedExampleNumber}
      />
    </div>
  );
};

export default PhoneNumberInput;
