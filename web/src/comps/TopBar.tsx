import {useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck, faCheckCircle, faGears,
    faGraduationCap, faPowerOff, faShareNodes,
    faWarning
} from "@fortawesome/free-solid-svg-icons";
import {dateToElapsed} from "../tools/DateString";
import {useEffect, useState} from "react";
import {getStudentData, getSyncStatus} from "../api/global.api";
import StudentData from "../models/StudentData";
import {vars} from "../api/api";

function NavElement(props: { text: string, icon: any, link: string }) {
    const navigate = useNavigate();
    const is_active = window.location.pathname.startsWith(props.link);

    return (
        <div
            className={"flex items-center text-white cursor-pointer px-5 h-full hover:bg-blue-900 transition " + (is_active ? "bg-blue-900" : "")}
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
        <div className={"flex px-1.5 flex-row items-center rounded-full bg-blue-300 bg-opacity-20"}>
            <FontAwesomeIcon icon={icon} className={color} fontSize={"13px"}/>
            <p className={"text-white text-xs my-1 ml-1 text-nowrap"}>Sync: {text}</p>
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

function UserComp() {
    const [user, setUser] = useState<StudentData | null>(null);

    useEffect(() => {
        getStudentData("myself").then((data) => {
            setUser(data);
        }).catch(() => {
        });
    }, []);

    if (user === null) return null;


    return <div className={"flex flex-row items-center gap-2"}>
        <div className={"flex flex-row items-center mr-2"}>
            <img
                src={`${vars.backend_url}/api/global/picture/${user.login}`}
                alt={"Profile Picture"}
                className={"w-8 h-8 rounded-full object-cover mr-2"}
            />

            <p className={"text-white text-nowrap"}>{user?.name}</p>
        </div>
        <div title={"Logout"} className={"text-center bg-black bg-opacity-0 hover:bg-opacity-20 h-full w-10 p-2 cursor-pointer transition"} onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
                localStorage.removeItem("auth");
                window.location.reload();
            }
        }}>
            <FontAwesomeIcon icon={faPowerOff} className={"text-red-500"}/>
        </div>
    </div>
}

export default function TopBar(): React.ReactElement {
    return (
        <div className={"flex h-10 flex-row items-center bg-gray-700 overflow-x-auto scroll-container"}>

            <div className={"flex flex-row items-center mr-8"}>
                <img
                    src={require("../assets/tblogo.png")}
                    alt={"TekBetter Logo"}
                    className={"w-9 ml-1"}
                />
                <p className={"text-white ml-1 mr-2 font-bold"}>TekBetter</p>
                <SyncStatus/>
            </div>

            <div className={"flex flex-row flex-grow justify-start ml-2 h-full gap-1"}>
                <NavElement text={"Moulinettes"} link={"/moulinettes"} icon={faGraduationCap}/>
                <NavElement text={"Modules"} link={"/modules"} icon={faShareNodes}/>
                <NavElement text={"Calendar"} link={"/calendar"} icon={faCalendarCheck}/>
                <NavElement text={"Synchronisation"} link={"/sync"} icon={faCheckCircle}/>
                <NavElement text={"Settings"} link={"/settings"} icon={faGears}/>
            </div>

            <UserComp/>
        </div>
    );
}