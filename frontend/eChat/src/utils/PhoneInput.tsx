import { useState, useEffect } from "react";
import { CountryCode, getCountries, getExampleNumber, Examples } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";



interface PhoneNumberInputProps {
  name: string;
  value: string;
  onChange: (phone: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({  value, onChange }) => {
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

  

  // Example phone number for selected country
  const exampleNumber = getExampleNumber(countryCode.toUpperCase() as CountryCode, {} as Examples);
  const formattedExampleNumber = exampleNumber ? exampleNumber.formatInternational() : "Enter your number";

  return (
    <div className="relative w-full">
      <PhoneInput
        country={countryCode}
        value={value}
        onChange={onChange}
        enableSearch={true}
        containerClass="relative w-full !border-2 !rounded-lg !bg-white !shadow-md hover:!shadow-lg transition-all duration-200 focus-within:!ring-2 focus-within:!ring-blue-600"
        inputClass="!w-full !text-black !font-medium !pl-24 font-bold !py-2 !border-none !outline-none !rounded-lg !ring-2 !ring-gray-300 focus:!ring-blue-500 placeholder:!text-gray-500"
        buttonClass="!bg-gray-100 !border-none !rounded-l-lg !px-4 !py-2"
        dropdownClass="!w-[290px] md:!w-[370px] lg:!w-[450px] !border !shadow-lg !rounded-lg !overflow-hidden"
        searchClass="!border !border-gray-300 !rounded-md !px-3 !py-2 !w-full focus:!outline-none focus:!ring-2 focus:!ring-blue-500"
        placeholder={formattedExampleNumber}
      />
    </div>
  );
};

export default PhoneNumberInput;
