import {useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck, faCheckCircle,
    faGraduationCap, faShareNodes,
    faWarning
} from "@fortawesome/free-solid-svg-icons";
import {dateToElapsed} from "../tools/DateString";
import {useEffect, useState} from "react";
import {getSyncStatus} from "../api/global.api";

function NavElement(props: { text: string, icon: any, link: string }) {
    const navigate = useNavigate();
    const is_active = window.location.pathname.startsWith(props.link);

    return (
        <div
            className={"flex flex-col rounded-2xl items-center justify-center cursor-pointer px-5 transition hover:bg-blue-800 hover:text-white " + (is_active ? "bg-blue-800 text-white font-bold" : "")}
            onClick={() => navigate(props.link)}>
            <div className={"flex flex-row items-center justify-center"}>
                <div>
                    <FontAwesomeIcon icon={props.icon}/>
                </div>
                <p className={"ml-2"}>{props.text}</p>
            </div>
        </div>
    );
}


function SyncStatus() {

    const [last_sync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
        const reload = async () => {
            const status = await getSyncStatus();
            let date = (() => {
                if (status.mouli !== null) return status.mouli;
                if (status.planning !== null) return status.planning;
                if (status.projects !== null) return status.projects;
                return null;
            })();
            setLastSync(date);
        }
        const interval = setInterval(async () => {
            reload().catch(() => {
            });
        }, 30000);
        reload().catch(() => {
        });
        return () => clearInterval(interval);
    }, []);


    const gen_visual = (color: string, icon: any, text: string) => (
        <div className={"flex px-1.5 flex-row items-center rounded-full bg-blue-300 bg-opacity-40"}>
            <FontAwesomeIcon icon={icon} className={color} fontSize={"13px"}/>
            <p className={"text-xs my-1 ml-1 text-nowrap"}>Sync: {text}</p>
        </div>
    );


    const total_minutes = (date: Date) => {
        const diff = new Date().getTime() - date.getTime();
        return Math.floor(diff / 60000);
    }

    if (last_sync === null)
        return gen_visual("text-red-500", faWarning, "Never Synced");

    if (total_minutes(last_sync) > 60)
        return gen_visual("text-red-500", faWarning, dateToElapsed(last_sync));
    else
        return gen_visual("text-green-500", faCheckCircle, dateToElapsed(last_sync));
}

export default function TopBar(): React.ReactElement {
    return (
        <div
            className={"flex flex-row justify-between items-center text-gray-700 overflow-x-auto p-3 scroll-container"}>


            <div className={"flex flex-row items-center mr-8 shadow-lg p-3 rounded-2xl"}>
                <img
                    src={require("../assets/tblogo.png")}
                    alt={"Epitech"}
                    className={"w-9 ml-1 shadow rounded-full"}
                />
                <p className={"ml-1 mr-2 font-bold"}>TekBetter</p>
            </div>


            <div className={"flex flex-row gap-2 rounded-2xl justify-start ml-2 h-full shadow-lg"}>
                <NavElement text={"Moulinettes"} link={"/moulinettes"} icon={faGraduationCap}/>
                <NavElement text={"Modules"} link={"/modules"} icon={faShareNodes}/>
                <NavElement text={"Calendar"} link={"/calendar"} icon={faCalendarCheck}/>
                <NavElement text={"Synchronisation"} link={"/sync"} icon={faCheckCircle}/>
            </div>

            <div className={"flex flex-row items-center mr-8 shadow-lg p-3 rounded-2xl"}>
                <img
                    src={require("../assets/tblogo.png")}
                    alt={"Epitech"}
                    className={"w-9 ml-1 shadow rounded-full"}
                />
                <p className={"ml-1 mr-2 font-bold"}>Eliot Amanieu</p>
                <SyncStatus/>
            </div>

        </div>
    );
}