import React from "react";
import Select from "react-select";
import { customStyles } from "../constants/customStyles";
// import { logoutOption } from "../constants/logoutOptions";
import { logoutOption } from "../constants/logoutOptions";
const LogoutDropdown = ({ onLogoutChange }) => {
    console.log(logoutOption[0].description);
    return (
        <Select
            placeholder={`More`}
            options={logoutOption}
            styles={customStyles}
            defaultValue={`More`}
            onChange={(selectedOption) => onLogoutChange(selectedOption)}
        />
    );
};

export default LogoutDropdown;