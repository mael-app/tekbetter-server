import React, {useEffect} from "react";
import WindowElem, {BasicBox} from "../comps/WindowElem";
import {getCalendarToken} from "../api/calendar.api";
import LoadingComp from "../comps/LoadingComp";
import NoSyncComp from "../comps/NoSyncComp";

function CopyUrl(props: { cal_name: string, token: string }) {

    const url = `${document.location.origin}/ical/${props.token}/${props.cal_name}.ics`;

    const copy = () => {
        navigator.clipboard.writeText(url).then(() => {
            alert("Copied to clipboard !");
        }, () => {
            alert("Failed to copy to clipboard !");
        });
    }


    return <div className={"flex flex-row items-center gap-2 w-full"}>
        <button onClick={copy} className={"ml-2 h-8 bg-blue-500 text-white px-2 rounded"}>Copy</button>

        <div
            className={"bg-gray-100 border-gray-300 border text-gray-500 shadow flex flex-row items-center rounded px-2 py-1 flex-grow overflow-x-auto"}
        >
            <p>{url}</p>
        </div>
    </div>
}

export default function CalendarPage(): React.ReactElement {

    const [token, setToken] = React.useState<string | null>(null);

    useEffect(() => {
        getCalendarToken().then((token) => {
            setToken(token);
        }).catch(() => {})
    }, []);

    if (token === null)
        return <LoadingComp/>

    return (
        <WindowElem title={<h1 className={"text-2xl"}>iCal export for your epitech calendar</h1>}>
            <div className={"p-3"}>
                 <NoSyncComp/>
                <h2 className={"font-bold"}>How it works ?</h2>
                <p>You can export your Epitech intra calendar with the iCal format. You have 3 available calendars
                    format:</p>


                <BasicBox className={"p-4"}>
                    <h3 className={"font-bold text-gray-700"}>Events calendar</h3>
                    <p>This calendar contains all the events like kick-offs, reviews, activities, etc.</p>
                    <CopyUrl cal_name={"activities"} token={token}/>
                </BasicBox>

                <BasicBox className={"p-4"}>

                    <h3 className={"font-bold text-gray-700"}>Projects calendar</h3>
                    <p>This calendar contains all projects deadlines represented by a full-day event, as the start and
                        end
                        date
                        of the project.</p>
                    <CopyUrl cal_name={"projects"} token={token}/>
                </BasicBox>

                <BasicBox className={"p-4"}>

                    <h3 className={"font-bold text-gray-700"}>Mixed calendar</h3>
                    <p>This calendar contains all the events and projects deadlines.</p>
                    <CopyUrl cal_name={"mixed"} token={token}/>
                </BasicBox>

            </div>

        </WindowElem>
    );
}