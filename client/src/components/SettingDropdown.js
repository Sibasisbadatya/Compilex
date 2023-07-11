import React from "react";
import Select from "react-select";
import { customStyles } from "../constants/customStyles";
import { settingOptions } from './../constants/settingOption';
const SettingDropdown = ({ onSettingChange }) => {
    console.log(settingOptions[0].description);
    return (
        <Select
            placeholder={`File`}
            options={settingOptions}
            styles={customStyles}
            defaultValue={`More`}
            onChange={(selectedOption) => onSettingChange(selectedOption)}
        />
    );
}

export default SettingDropdown
