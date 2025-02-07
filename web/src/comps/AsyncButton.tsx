import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

export default function AuthButton(props: { text: string, icon: any, onClick: () => Promise<any>, disabled?: boolean }) {
    const [loading, setLoading] = React.useState<boolean>(false);

    return <div
        className={"flex flex-row items-center gap-2"}
        onClick={() => {
            setLoading(true);
            props.onClick().finally(() => setLoading(false));
        }}>
        <div
            className={"flex flex-row items-center gap-2 w-full justify-center text-white p-2 rounded " + (props.disabled ? "cursor-not-allowed hover:bg-gray-500 bg-gray-400" : "bg-blue-500 cursor-pointer hover:bg-blue-600")}>
            <FontAwesomeIcon icon={loading ? faSpinner : props.icon} spin={loading}/>
            <p>{props.text}</p>
        </div>
    </div>
}
