import React from "react";

export default function NoSyncComp() : React.ReactElement {
    return (
        <div className={"shadow flex-grow text-center"}>
            <h1 className={"font-bold text-red-400 text-2xl"}>Your account was never synced</h1>
            <p>
                Please go to the Sync page to connect your epitech microsoft account with TekBetter
            </p>

        </div>
    )
}