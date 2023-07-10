import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import { customStyles } from "../constants/customStyles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendRoute } from "../utils/APIRoutes";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";

// const javascriptDefault = `

// `;

const Landing = () => {
    const [customInput, setCustomInput] = useState("");
    const [outputDetails, setOutputDetails] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [theme, setTheme] = useState("cobalt");
    const [language, setLanguage] = useState(languageOptions[0]);
    let defaultCode = `#include <iostream>
    int main() {
        std::cout << "hello, world" << std::endl;
        return 0;
    }`;
    const getlanFun = () => {
        console.log("called");
        const getlan = localStorage.getItem("lan-snpt");
        console.log("getlan", getlan);
        defaultCode = `${getlan}`;
        console.log("defaultCode", defaultCode);
    }
    const [code, setCode] = useState(defaultCode);
    const enterPress = useKeyPress("Enter");
    const ctrlPress = useKeyPress("Control");
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("comp-key")) {
            navigate("/login");
        }
    })
    const onSelectChange = (sl) => {
        const slan = sl;
        localStorage.setItem("lan-snpt", sl.snippet);
        getlanFun();
        console.log("selected Option...", sl.snippet);
        setLanguage(sl);
    };

    useEffect(() => {
        if (enterPress && ctrlPress) {
            console.log("enterPress", enterPress);
            console.log("ctrlPress", ctrlPress);
            handleCompile();
        }
    }, [ctrlPress, enterPress]);
    const onChange = (action, data) => {
        switch (action) {
            case "code": {
                setCode(data);
                break;
            }
            default: {
                console.warn("case not handled!", action, data);
            }
        }
    };
    const handleCompile = async () => {
        setProcessing(true);
        const formData = {
            language_id: language.id,
            source_code: btoa(code),
            stdin: btoa(customInput),
        };
        const options = {
            method: "POST",
            url: "https://judge0-ce.p.rapidapi.com/submissions",
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                // "content-type": "application/json",
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                "X-RapidAPI-Key": "7e303cd5f5msha2909317898e81bp1e5049jsnaf3cafdb3f00",
            },
            data: formData,
        };
        axios
            .request(options)
            .then(function (response) {
                console.log("res.data", response.data);
                const token = response.data.token;
                checkStatus(token);
            })
            .catch(async (err) => {
                let error = await err.response ? err.response.data : err;
                // get error status
                let status = await err.response.status;
                console.log("status", status);
                if (status === 429) {
                    console.log("too many requests", status);

                    showErrorToast(
                        `Quota of 100 requests exceeded for the Day!`,
                        10000
                    );
                }
                setProcessing(false);
                console.log("catch block...", error);
            });
        // const sendOptions = {
        //     method: "POST",
        //     url: `${sendRoute}`,
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     data: formData,
        // };
    };

    const checkStatus = async (token) => {
        const options = {
            method: "GET",
            url: "https://judge0-ce.p.rapidapi.com/submissions" + "/" + token,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                "X-RapidAPI-Key": "7e303cd5f5msha2909317898e81bp1e5049jsnaf3cafdb3f00",
            },
        };
        try {
            let response = await axios.request(options);
            let statusId = response.data.status?.id;

            // Processed - we have a result
            if (statusId === 1 || statusId === 2) {
                // still processing
                setTimeout(() => {
                    checkStatus(token);
                }, 2000);
                return;
            } else {
                setProcessing(false);
                setOutputDetails(response.data);
                showSuccessToast(`Compiled Successfully!`);
                console.log("response.data", response.data);
                const resend = response.data;
                const { data } = await axios.post(sendRoute, {
                    data: { language: resend.language.name, status: resend.status.description, stdin: atob(resend.stdin), stdout: atob(resend.stdout), source_code: atob(resend.source_code) },
                    uid: JSON.parse(localStorage.getItem("comp-key"))._id
                });
                console.log(data);
                return;
            }
        } catch (err) {
            console.log("err", err);
            setProcessing(false);
            showErrorToast();
        }
    };

    function handleThemeChange(th) {
        const theme = th;
        console.log("theme...", theme);

        if (["light", "vs-dark"].includes(theme.value)) {
            setTheme(theme);
        } else {
            defineTheme(theme.value).then((_) => setTheme(theme));
        }
    }
    useEffect(() => {
        defineTheme("oceanic-next").then((_) =>
            setTheme({ value: "oceanic-next", label: "Oceanic Next" })
        );
    }, []);

    const showSuccessToast = (msg) => {
        toast.success(msg || `Compiled Successfully!`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    const showErrorToast = (msg, timer) => {
        toast.error(msg || `Something went wrong! Please try again.`, {
            position: "top-right",
            autoClose: timer ? timer : 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />


            <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
            <div className="d-flex flex-row bd-highlight mb-3" style={{ display: "flex" }}>
                <div style={{ margin: "0.5rem 3rem" }}>
                    <LanguagesDropdown onSelectChange={onSelectChange} />
                </div>
                <div style={{ margin: "0.5rem 3rem" }}>
                    <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
                </div>
                <div>
                    <button
                        onClick={handleCompile}
                        disabled={!code}
                        style={{
                            backgroundColor: "#fff",
                            maxWidth: "14rem",
                            width: "8rem",
                            border: "2px solid #000000",
                            height: "3rem",
                            borderRadius: "5px",
                            marginLeft: "10px",
                            marginTop: "8px",
                            backgroundColor: "#0984e3",
                            boxShadow: "5px 5px 0px 0px rgba(0,0,0);",
                            cursor: "pointer"
                        }}
                        className={classnames(
                            "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                            !code ? "opacity-50" : ""
                        )}
                    >
                        {processing ? "Processing..." : "Run"}
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "./";
                        }}
                        style={{
                            backgroundColor: "#fff",
                            maxWidth: "14rem",
                            width: "8rem",
                            border: "2px solid #000000",
                            height: "3rem",
                            borderRadius: "5px",
                            marginLeft: "10px",
                            marginTop: "8px",
                            backgroundColor: "#d63031",
                            boxShadow: "5px 5px 0px 0px rgba(0,0,0);",
                            cursor: "pointer",
                            marginLeft: "50rem",
                        }}>Logout</button>
                </div>
            </div>
            <div className="flex flex-row space-x-4 items-start px-4 py-4">
                <div className="flex flex-col w-full h-full justify-start items-end">
                    <CodeEditorWindow
                        code={code}
                        onChange={onChange}
                        language={language?.value}
                        theme={theme.value}
                    />
                </div>

                <div className="right-container flex flex-shrink-0 w-[30%] flex-col" style={{ display: "flex", backgroundColor: "#2d3436", marginTop: "1rem", minHeight: "20vh", padding: "2rem", position: "relative" }}>
                    <div className="flex flex-col items-end">
                        <CustomInput
                            customInput={customInput}
                            setCustomInput={setCustomInput}
                        />
                    </div>
                    <div className="flex flex-col items-end"
                        style={{ backgroundColor: "#2d3436", color: "white", border: "2px solid #b2bec3", width: "30vw", minHeight: "90%", marginLeft: "5vw", padding: "1rem" }}
                        placeholder={`Output Terminal`} >
                        <OutputWindow outputDetails={outputDetails} />
                    </div>
                    <div className="flex flex-col items-end"
                        style={{
                            backgroundColor: "#2d3436", color: "white", border: "2px solid #b2bec3", width: "30vw", minHeight: "90%", marginLeft: "5vw", padding: "1rem"
                        }}
                        placeholder={`Output Details`}>
                        {outputDetails && <OutputDetails outputDetails={outputDetails} />}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default Landing;