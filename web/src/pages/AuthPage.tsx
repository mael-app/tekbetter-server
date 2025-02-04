import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faArrowsSpin,
    faCheckCircle,
    faSpinner,
    faWarning, faXmarkCircle
} from "@fortawesome/free-solid-svg-icons";
import GithubLogo from "../assets/githublogo.svg";
import {getLoginStatus, isValidTicket, loginWithPassword, registerWithTicket, resetPassword} from "../api/auth.api";


function AuthButton(props: { text: string, icon: any, onClick: () => Promise<any>, disabled?: boolean }) {
    const [loading, setLoading] = React.useState<boolean>(false);

    return <div
        className={"flex flex-row items-center gap-2"}
        onClick={() => {
            props.onClick().finally(() => setLoading(false));
        }}>
        <div
            className={"flex flex-row items-center gap-2 w-full justify-center text-white p-2 rounded " + (props.disabled ? "cursor-not-allowed hover:bg-gray-500 bg-gray-400" : "bg-blue-500 cursor-pointer hover:bg-blue-600")}>
            <FontAwesomeIcon icon={loading ? faSpinner : props.icon} spin={loading}/>
            <p>{props.text}</p>
        </div>
    </div>
}

export default function AuthPage(): React.ReactElement {

    const [login_email, setLoginEmail] = React.useState<string>("");
    const [login_password, setLoginPassword] = React.useState<string>("");

    const [is_ticket_valid, setIsTicketValid] = React.useState<boolean | null>(null);

    const params = new URLSearchParams(window.location.search);

    const register_ticket = params.get("ticket");

    const [register_password, setRegisterPassword] = React.useState<{
        password: string,
        confirm: string
    }>({
        password: "",
        confirm: ""
    } as { password: string, confirm: string });

    const [page, setPage] = React.useState<"email" | "password" | "register" | "create_password" | "reset">(register_ticket ? "create_password" : "email");

    const is_valid_password = () => {
        // min 8 characters, 1 uppercase, 1 lowercase, 1 number
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return reg.test(register_password.password);
    }

    useEffect(() => {
        if (page === "create_password") {
            isValidTicket(register_ticket!).then((res) => {
                setIsTicketValid(res);
            });
        }
    }, []);

    const btnCreateAccount = async () => {
        const status = await registerWithTicket(register_ticket!, register_password.password);
        if (!status) {
            alert("Registration failed. Please try again.");
            return;
        }
    }

    const btnValidateEmail = async () => {
        const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email_regex.test(login_email) || !login_email.endsWith("@epitech.eu")) {
            alert("Please enter a valid Epitech email address.");
            return;
        }
        const status = await getLoginStatus(login_email);
        if (status === "login")
            setPage("password")
        else if (status === "register")
            setPage("register")
    }

    const btnLoginPassword = async () => {
        const status = await loginWithPassword(login_email, login_password);
        if (!status) {
            alert("Login failed. Please check your email and password.");
            return;
        }
    }

    const btnResetPassword = async () => {
        const status = await resetPassword(login_email);
        if (!status) {
            alert("Reset failed. Please check your email address.");
            return;
        }
        setPage("register");
    }


    return (
        <div className={"flex flex-row gap-4 justify-center items-center h-full"}>
            <div className={"p-10 shadow rounded bg-white"}>
                <div className={"flex flex-col items-center gap-5 mb-6"}>
                    <img
                        src={require("../assets/tblogo.png")}
                        alt={"Epitech logo"}
                        className={"w-24"}
                    />
                    <div>
                        <h1 className={"font-bold text-nowrap text-center "}>Welcome to TekBetter !</h1>
                        <div className={"flex flex-col items-center"}>
                            <p className={"text-gray-400 text-center italic"}>
                                An unofficial dashboard for Epitech students.
                            </p>
                        </div>
                    </div>
                </div>

                {
                    page === "email" && <>
                        <div className={"mb-2"}>
                            <label className={"block"}>Email</label>
                            <input type={"email"} placeholder={"grace.hopper@epitech.eu"}
                                   className={"w-full p-2 border border-gray-300 rounded"}
                                   value={login_email}
                                   autoComplete="email"
                                   onChange={(e) => setLoginEmail(e.target.value)}
                                   onKeyPress={async (e) => {
                                       if (e.key === "Enter") await btnValidateEmail()
                                   }}
                            />
                        </div>

                        <AuthButton icon={faArrowRight} text={"Continue"} onClick={btnValidateEmail}/>
                    </>
                }
                {
                    page === "reset" && <>
                        <div className={"mb-2"}>
                                <h1 className={"font-bold text-center text-red-600"}>
                                   Reset your tekbetter password
                                </h1>
                            <p className={"max-w-96 text-gray-400 my-2 italic text-xs"}>
                                If you have forgotten your TekBetter password, you can reset it by receiving a confirmation email.
                            </p>

                            <label className={"block"}>Epitech email:</label>
                            <input type={"email"} placeholder={"imanoob@epitech.eu"}
                                   className={"w-full p-2 border border-gray-300 rounded"}
                                   value={login_email}
                                   autoComplete="email"
                                   onChange={(e) => setLoginEmail(e.target.value)}
                                   onKeyPress={async (e) => {
                                       if (e.key === "Enter") await btnResetPassword()
                                   }}
                            />
                        </div>

                        <AuthButton icon={faArrowRight} text={"Continue"} onClick={btnValidateEmail}/>
                    </>
                }

                {
                    page === "password" && <>
                        <div className={"mb-2"}>
                            <label className={"block"}>Enter your tekbetter password</label>
                            <input type={"password"} placeholder={"TekBetter password"}
                                   className={"w-full p-2 border border-gray-300 rounded"}
                                   value={login_password}
                                   autoComplete="current-password"
                                   onChange={(e) => setLoginPassword(e.target.value)}
                                   onKeyPress={async (e) => {
                                       if (e.key === "Enter") await btnLoginPassword()
                                   }}
                            />
                        </div>

                        <AuthButton icon={faArrowRight} text={"Login"} onClick={btnLoginPassword}/>
                    </>
                }

                {
                    page === "register" && <>
                        <div className={"mb-2c flex flex-col items-center"}>
                            <FontAwesomeIcon icon={faCheckCircle} className={"text-green-500 text-2xl"}/>
                            <p className={"w-64 text-center text-gray-500"}>
                                An email has been sent to your Epitech email address with a verification link. Please check
                                your inbox.
                            </p>
                        </div>
                    </>
                }


                {
                    page === "create_password" && <>
                        {
                            is_ticket_valid ? (
                                <div className={"mb-2"}>
                                    <label className={"block"}>Create your password</label>
                                    <div className={"flex flex-row items-center mb-2 gap-1"}>
                                        <FontAwesomeIcon icon={faWarning} className={"text-red-300"}/>
                                        <p className={"text-gray-400 italic"}>Use a secured and personal password. You will
                                            use it
                                            to login to TekBetter.</p>
                                    </div>
                                    <input required type={"password"} placeholder={"TekBetter password"}
                                           className={"w-full p-2 border border-gray-300 rounded"}
                                           value={register_password.password}
                                           autoComplete="new-password"
                                           onChange={(e) => setRegisterPassword({
                                               ...register_password,
                                               password: e.target.value
                                           })}
                                           onKeyPress={async (e) => {
                                               if (e.key === "Enter") await btnCreateAccount()
                                           }}
                                    />
                                    <p className={"text-gray-400 text-sm italic"}>
                                        Passwords must be at least 8 characters long and contain at least one uppercase
                                        letter, one
                                        lowercase letter, and one number.
                                    </p>
                                    {
                                        !is_valid_password() &&
                                        <p className={"text-red-500 text-sm"}>Bad password format</p>
                                    }
                                    <input required type={"password"} placeholder={"Confirm"}
                                           className={"w-full p-2 border border-gray-300 rounded"}
                                           value={register_password.confirm}
                                           autoComplete="new-password"
                                           onChange={(e) => setRegisterPassword({
                                               ...register_password,
                                               confirm: e.target.value
                                           })}
                                           onKeyPress={async (e) => {
                                               if (e.key === "Enter") await btnCreateAccount()
                                           }}
                                    />
                                    {
                                        register_password.password !== register_password.confirm &&
                                        <p className={"text-red-500 text-sm"}>Passwords do not match</p>
                                    }
                                </div>) : is_ticket_valid === false ? (
                                <div className={"mb-2c flex flex-col items-center"}>
                                    <FontAwesomeIcon icon={faXmarkCircle} className={"text-red-500 text-2xl"}/>
                                    <p className={"w-64 text-center text-gray-500"}>
                                        This verification link is invalid or has expired. Please request a new one by
                                        refreshing the page.
                                    </p>
                                </div>
                            ) : (
                                <div className={"mb-2c flex flex-col items-center"}>
                                    <FontAwesomeIcon icon={faArrowsSpin} className={"text-blue-500 text-2xl"} spin={true}/>
                                    <p className={"w-64 text-center text-gray-500"}>
                                        Verifying...
                                    </p>
                                </div>
                            )
                        }
                        <AuthButton icon={faArrowRight}
                                    disabled={register_password.password !== register_password.confirm || !is_valid_password()}
                                    text={"Create my account"} onClick={btnCreateAccount}/>
                    </>
                }

                <div className={"flex flex-row items-center justify-between mt-2"}>


                    <div
                        className={"flex-row flex items-center gap-1 hover:bg-gray-100 w-min px-1 rounded-2xl cursor-pointer"}
                        onClick={() => window.open("https://github.com/EliotAmn/tekbetter-server", "_blank")}>
                        <div className={"w-6"}>
                            <GithubLogo/>
                        </div>
                        <p className={"text-nowrap"}>Source code</p>
                    </div>

                    <div>
                        {
                            page === "email" &&  <p onClick={() => setPage("reset")} className={"text-nowrap text-blue-400 hover:text-blue-600 cursor-pointer"}>Forgot password?</p>
                        }

                    </div>
                </div>

            </div>

        </div>

    );
}