import React, {useEffect} from "react";
import WindowElem, {BasicBox} from "../comps/WindowElem";
import LoadingComp from "../comps/LoadingComp";
import {getSettings, putSettings} from "../api/settings.api";
import {changePasswordRequest} from "../api/auth.api";

export default function SettingsPage(): React.ReactElement {


    const [shareAllowed, setShareAllowed] = React.useState<boolean | null>(null);

    const [changePassword, setChangePassword] = React.useState<{oldPassword: string, newPassword: string, confirmNewPassword: string}>({oldPassword: "", newPassword: "", confirmNewPassword: ""});

    useEffect(() => {
        getSettings().then((settings) => {
            setShareAllowed(settings.share_enabled);
        });
    }, []);

    const is_valid_password = () => {
        // min 8 characters, 1 uppercase, 1 lowercase, 1 number
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return reg.test(changePassword.newPassword);
    }

    if (shareAllowed === null)
        return <LoadingComp/>

    return (
        <div className="">
            <WindowElem
                className={"p-5"}
                title={<h1 className="text-2xl">User settings</h1>}
            >
                <WindowElem className={"w-96"} title={<h1 className="text-xl">Show scores of other students</h1>}>
                    <h1>This setting permit you to see the position of other students on all moulinettes, by sharing
                        your scores with them.</h1>

                    <BasicBox className={"flex flex-row items-center gap-2"}>
                        <h1>Share scores with other students</h1>
                        <input type="checkbox" checked={shareAllowed} onChange={(e) => {
                            setShareAllowed(e.target.checked);
                            putSettings({share_enabled: e.target.checked});
                        }}/>
                    </BasicBox>
                </WindowElem>

                <WindowElem className={"w-96"} title={<h1 className="text-xl">Change Tekbetter password</h1>}>


                    <BasicBox className={"flex flex-col gap-2"}>

                        <div>
                            <h1>Old password</h1>
                            <input type="password" placeholder="marvin123"
                                   className={"w-full p-2 rounded-md bg-gray-100 text-gray-800 mt-2"}
                                   onChange={(e) => setChangePassword({...changePassword, oldPassword: e.target.value})}/>

                        </div>

                        <div>
                            <h1>New password</h1>
                            <input type="password" placeholder="marvin123"
                                   className={"w-full p-2 rounded-md bg-gray-100 text-gray-800 mt-2"}
                                   onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}/>
                            {
                                !is_valid_password() && changePassword.newPassword.length > 0 && <h1 className={"text-red-500"}>Password must contain at least 8 characters, 1 uppercase, 1 lowercase and 1 number</h1>
                            }
                        </div>

                        <div>
                            <h1>Confirm new password</h1>
                            <input type="password" placeholder="marvin123"
                                   className={"w-full p-2 rounded-md bg-gray-100 text-gray-800 mt-2"}
                                   onChange={(e) => setChangePassword({...changePassword, confirmNewPassword: e.target.value})}/>
                            {
                                changePassword.newPassword !== changePassword.confirmNewPassword && changePassword.confirmNewPassword.length > 0 && <h1 className={"text-red-500"}>Passwords do not match</h1>
                            }
                        </div>


                        <button className={"bg-blue-500 text-white p-2 rounded-md mt-2"} onClick={() => {
                            if (changePassword.newPassword !== changePassword.confirmNewPassword) {
                                alert("New password and confirm new password do not match");
                                setChangePassword({...changePassword, newPassword: "", confirmNewPassword: ""});
                                return;
                            }
                            changePasswordRequest(changePassword.oldPassword, changePassword.newPassword).then((res) => {
                                if (res)
                                    alert("Password changed successfully");
                                else
                                    alert("Failed to change password");
                            });
                        } }>Change password</button>

                    </BasicBox>
                </WindowElem>

            </WindowElem>

        </div>


    );
}