import React from "react";
import { classnames } from "../utils/general";

const CustomInput = ({ customInput, setCustomInput }) => {
    return (
        <>
            {" "}
            <textarea
                style={{ backgroundColor: "#2d3436", color: "white", border: "2px solid #b2bec3", width: "15vw", minHeight: "90%", marginLeft: "5vw" }}
                rows="5"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={`Custom input`}
                className={classnames(
                    "focus:outline-none w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white mt-2"
                )}
            ></textarea>
        </>
    );
};

export default CustomInput;