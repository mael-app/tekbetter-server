import React, {useEffect} from "react";
import WindowElem, {BasicBox} from "../comps/WindowElem";
import {getCalendarToken, regenCalendarToken} from "../api/calendar.api";
import {deleteMicrosoftToken, putMicrosoftToken} from "../api/sync.api";
import LoadingComp from "../comps/LoadingComp";


function PublicScraperSetup() {
    const [microToken, setMicroToken] = React.useState<string>("");


    return (
        <div className="p-3">
            <h2 className="font-bold">How it's works ?</h2>
            <p className="text-gray-500">
                You provide a Microsoft session cookie below. It will be stored on a
                private and secured database with encryption methods. There are multiple
                scraper services, and your Intra & MyEpitech data will be scraped by one
                of them. Recommended if you can't host your own scraper.
            </p>

            <p>
                <span className="font-bold text-red-500">Warning:</span> This service is
                not affiliated with Epitech, and the data is stored on a private server.
                Use it at your own risk.
            </p>
            <p>
                <span className="font-bold text-blue-500">How can I get my Microsoft cookie?</span>
                You can follow
                <a
                    href="https://github.com/EliotAmn/tekbetter-server/blob/main/docs/HOW_TO_GET_COOKIES.md"
                    className="text-blue-500 mx-1"
                    target="_blank"
                >
                    this guide
                </a>{" "}
                to get your Microsoft session cookie.
            </p>

            <BasicBox className="p-4 flex flex-wrap items-start gap-2">
                <div className="">
                    <h3 className="font-bold text-gray-700">Update your Microsoft cookie</h3>
                    <p>
                        If you have changed your Microsoft password, or the token is
                        expired, you need to re-enter it below.
                    </p>
                    <input
                        value={microToken || ""}
                        type="text"
                        className="w-full p-2 border-gray-300 border rounded"
                        placeholder="Paste your Microsoft session cookie here"
                        onChange={(e) => setMicroToken(e.target.value)}
                    />
                    <button
                        className="mt-2 h-8 bg-blue-500 text-white px-2 rounded"
                        onClick={() => {
                            putMicrosoftToken(microToken!).then(() => setMicroToken(""));
                        }}
                    >
                        Update
                    </button>
                </div>
                <div className="flex-1 min-w-[calc(50%-0.5rem)] sm:min-w-[50%]">
                    <h3 className="font-bold text-gray-700">Disable the internal scraper mode</h3>
                    <p>
                        If you want to stop the scraper, you can disable it here. Your
                        token will be deleted from the database.
                    </p>
                    <button
                        className="mt-2 h-8 bg-red-500 text-white px-2 rounded"
                        onClick={() => {
                            if (window.confirm("Are you sure ? Your token will be deleted.")) {
                                deleteMicrosoftToken().then(null).catch(() => {
                                });
                            }
                        }}
                    >
                        Delete my token
                    </button>
                </div>
            </BasicBox>
        </div>
    )
}


export default function SyncPage(): React.ReactElement {

    const [token, setToken] = React.useState<string | null>(null);
    const [microToken, setMicroToken] = React.useState<string>("");

    useEffect(() => {
        getCalendarToken().then((token: string) => {
            setToken(token);
        }).catch(() => {
        });
    }, []);

    if (token === null)
        return <LoadingComp/>

    return (
        <div className="flex flex-col gap-4">
            <WindowElem
                className={""}
                title={<h1 className="text-2xl">Use an internal scraper</h1>}
            >
                {null}
            </WindowElem>

            <WindowElem
                className=""
                title={<h1 className="text-2xl">Host your own scraper</h1>}
            >
                <div className="p-3 flex flex-col">
                    <h2 className="font-bold">How it works ?</h2>
                    <p className="text-gray-500 text-justify">
                        The tekbetter data scraper is open-source. You can install it on your own
                        server, and use it to get your data. For authentication, you need to
                        provide a token on the scraper configuration, to authorize it to push
                        your data to your account.
                    </p>

                    <h3 className="font-bold text-gray-700">Install the scraper: </h3>
                    <a
                        href="https://github.com/EliotAmn/tekbetter-scraper"
                        target="_blank"
                        className="text-blue-500"
                    >
                        Github repository
                    </a>

                    <h3 className="font-bold text-gray-700">Your upload token: </h3>
                    <code className="bg-gray-100 p-2 rounded overflow-x-auto">{token}</code>

                    <h3 className="font-bold text-gray-700">
                        This is the API URL you need to use in the scraper config:
                    </h3>
                    <code className="bg-gray-100 p-2 rounded">{document.location.origin}</code>

                    <button
                        className="mt-2 h-8 bg-red-500 text-white px-2 rounded"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Are you sure ? Your token will be regenerated. This token is used for scrapers and the calendar export urls."
                                )
                            ) {
                                regenCalendarToken()
                                    .then((token) => {
                                        setToken(token);
                                    })
                                    .catch(() => {
                                    });
                            }
                        }}
                    >
                        Reload my token
                    </button>
                </div>
            </WindowElem>
        </div>


    );
}