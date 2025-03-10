import React, {useEffect} from "react";
import WindowElem from "../../comps/WindowElem";
import {getCalendarToken, regenCalendarToken} from "../../api/calendar.api";
import {deleteMicrosoftToken, putMicrosoftToken} from "../../api/sync.api";
import LoadingComp from "../../comps/LoadingComp";
import {faEarth, faGear, faSquareArrowUpRight, faWarning} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "../../comps/Button";
import SyncStatusWindow from "./SyncStatusWindow";


function PublicScraperSetup() {
    const [microToken, setMicroToken] = React.useState<string>("");

    return (
        <div className="p-3">
            <h2 className="font-bold">How it's works ?</h2>
            <p className="text-gray-400">
                You provide a Microsoft session cookie below. It will be stored on a
                private and secured database with encryption methods. There are multiple
                scraper services, and your Intra & MyEpitech data will be scraped by one
                of them. Recommended if you can't host your own scraper.
            </p>

            <p className={"mt-2"}>
                <FontAwesomeIcon icon={faWarning} className={"text-red-500"}/> This service is
                not affiliated with Epitech, and the data is stored on a private server.
                Use it at your own risk.
            </p>
            <div className={"w-min mt-2"}>

                <Button icon={faSquareArrowUpRight} text={"Setup tutorial"}
                        onClick={() => window.open("https://github.com/EliotAmn/tekbetter-server/blob/main/docs/HOW_TO_GET_COOKIES.md")}/>
            </div>

            <div className="flex flex-row items-center gap-2">
                <img
                    src={require("../../assets/microsoft.png")}
                    alt="Microsoft logo"
                    className="w-36"
                />
                <div>
                    <h3 className="font-bold text-gray-400">Update your Microsoft cookie</h3>
                    <p>
                        If you have changed your Microsoft password, or the token is
                        expired, you need to re-enter it below.
                    </p>
                    <input
                        value={microToken || ""}
                        type="text"
                        className="w-full p-2 border-gray-300 dark:border-gray-700 border rounded text-xs dark:bg-gray-700"
                        placeholder="1.HCV68Z8Xq3rkJdH3TY..."
                        onChange={(e) => setMicroToken(e.target.value)}
                    />
                    <button
                        className="mt-2 h-8 bg-blue-500 text-white px-2 rounded"
                        onClick={() => {
                            if (!microToken.startsWith("1.")) {
                                alert("You must enter your Microsoft token, see the \"Get my cookie\" button below.")
                                return;
                            }
                            putMicrosoftToken(microToken!).then(() => setMicroToken(""));
                        }}
                    >
                        Use this session cookie
                    </button>
                </div>

            </div>

            <p className={"flex flex-row gap-1 items-center text-gray-400 text-sm italic"}>
                Want to disable this scraping method ? <p className={"text-red-500 cursor-pointer"} onClick={() => {
                if (window.confirm("Are you sure ? Your token will be deleted.")) {
                    deleteMicrosoftToken().then(() => alert("Your token has been deleted.")).catch(() => {
                        alert("An error occurred while deleting your token.");
                    });
                }
            }}>
                click here
            </p> to delete your token.
            </p>
        </div>
    )
}

function PrivateScraperSetup() {
    const [token, setToken] = React.useState<string | null>(null);


    useEffect(() => {
        getCalendarToken().then((token: string) => {
            setToken(token);
        }).catch(() => {
        });
    }, []);

    const scraper_config = {
        "intervals": {
            "moulinettes": 30,
            "projects": 60,
            "planning": 120,
            "modules": 120,
            "profile": 120
        },
        "students": [
            {
                "microsoft_session": "1.AXQAyrQckGK4KUCTBuXN.... use your own session cookie",
                "tekbetter_token": token,
            }
        ]
    }

    return (
        <div className="p-3 flex flex-col">
            <h2 className="font-bold">How it works ?</h2>
            <p className="text-gray-500 text-justify">
                The tekbetter data scraper is open-source. You can install it on your own
                server, and use it to get your data. For authentication, you need to
                provide a token on the scraper configuration, to authorize it to push
                your data to your account.
            </p>

            <h3 className="font-bold text-gray-500">Install the scraper: </h3>
            <a
                href="https://github.com/EliotAmn/tekbetter-scraper"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
            >
                Github repository
            </a>

            <div className={"w-min mt-2"}>

                <Button icon={faSquareArrowUpRight} text={"Get my cookie"}
                        onClick={() => window.open("https://github.com/EliotAmn/tekbetter-server/blob/main/docs/HOW_TO_GET_COOKIES.md")}/>
            </div>

            <h3 className="font-bold text-gray-400">Your upload token: </h3>
            <code className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs p-2 rounded overflow-x-auto">{token ? token :
                <LoadingComp/>}</code>

            <h3 className="font-bold text-gray-400">
                This is the API URL you need to use in the scraper config:
            </h3>
            <code className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs p-2 rounded">{document.location.origin}</code>

            <h3 className="font-bold text-gray-400">
                You can use this example config for your scraper.json file.
            </h3>
            <code className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs p-2 rounded">
                <pre>{JSON.stringify(scraper_config, null, 2)}</pre>

            </code>

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
                Regen my token
            </button>
        </div>
    );
}

export default function SyncPage(): React.ReactElement {

    const [page, setPage] = React.useState<"public" | "private">("public");

    return (
        <div className="flex flex-col gap-4">
            <WindowElem
                className={""}
                title={<h1 className="text-2xl">Link your tekbetter account with your Epitech account</h1>}
            >
                <div className="p-3 grid xl:grid-cols-2 gap-4">

                    <WindowElem title={"Configure scraper"} className="">
                        <div className={"flex justify-center items-center flex-col"}>
                            <div className="flex flex-row rounded shadow w-min mt-2">
                                {
                                    [{
                                        page: "public",
                                        icon: faEarth,
                                        title: "Use our system",
                                    }, {
                                        page: "private",
                                        icon: faGear,
                                        title: "Use your own (avanced)",
                                    }].map((item) => (
                                        <div
                                            className={`flex flex-nowrap flex-row rounded transition items-center gap-2 p-2 cursor-pointer ${page === item.page ? "bg-blue-700 text-gray-100 " : ""}`}
                                            onClick={() => setPage(item.page as "public" | "private")}>
                                            <FontAwesomeIcon icon={item.icon} className="text-2xl"/>
                                            <h2 className={"text-nowrap"}>{item.title}</h2>
                                        </div>
                                    ))
                                }
                            </div>
                            {page === "public" ? <PublicScraperSetup/> : <PrivateScraperSetup/>}
                        </div>
                    </WindowElem>
                    <WindowElem title={"Live scraper status"} className="">
                        <SyncStatusWindow/>
                    </WindowElem>
                </div>

            </WindowElem>
        </div>
    );
}