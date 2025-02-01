import React, {useEffect} from "react";
import WindowElem, {BasicBox} from "../comps/WindowElem";
import {getCalendarToken, regenCalendarToken} from "../api/calendar.api";
import {deleteMicrosoftToken, putMicrosoftToken} from "../api/sync.api";
import LoadingComp from "../comps/LoadingComp";
import {getSettings, putSettings} from "../api/settings.api";

export default function SettingsPage(): React.ReactElement {


    const [shareAllowed, setShareAllowed] = React.useState<boolean | null>(null);

    useEffect(() => {
        getSettings().then((settings) => {
            setShareAllowed(settings.share_enabled);
        });
    }, []);

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

            </WindowElem>

        </div>


    );
}