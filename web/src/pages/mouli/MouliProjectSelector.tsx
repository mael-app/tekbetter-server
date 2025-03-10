import {markAllProjectsAsSeen, markProjectAsSeen} from "../../api/project.api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faWarning} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {EpiProject} from "../../models/Project";
import {useNavigate, useParams} from "react-router";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import scoreColor from "../../tools/ScoreColor";
import {dateToElapsed} from "../../tools/DateString";


function Project(props: {
    project_slug: string,
    project_name: string,
    score: number,
    last_test: Date,
    seen: boolean,
    is_warning?: boolean
}) {
    const params = useParams();
    const [isNewClicked, setIsNewClicked] = React.useState<boolean>(false);

    const is_selected = params.project_slug === props.project_slug;
    const navigate = useNavigate();

    return <div
        className={"relative shadow text rounded-2xl flex flex-row items-center p-2 cursor-pointer transition " + (is_selected ? " shadow-lg" : "hover:bg-gray-100")}
        onClick={() => {
            navigate(`/moulinettes/${props.project_slug}`);
            if (!props.seen && !isNewClicked) {
                setIsNewClicked(true);
                markProjectAsSeen(props.project_slug).catch(() => console.error("Failed to mark as read"));
            }
        }}>


        {props.is_warning && <div className={"absolute right-2 bottom-0"}>
            <FontAwesomeIcon icon={faWarning} className={"text-red-500 text-xs"}/>
        </div>}

        <div className={"w-12"}>
            <CircularProgressbar
                value={props.score}
                strokeWidth={7}
                text={`${Math.round(props.score)}`}
                styles={
                    buildStyles({
                        textColor: scoreColor(props.score).html,
                        pathColor: scoreColor(props.score).html,
                        trailColor: "rgba(0,0,0,0.06)",
                        textSize: "30",
                    })
                }/>
        </div>
        <div className={"ml-2"}>
            <h3 className={"font-bold text-sm"}>{props.project_name}</h3>
            <p className={"text-xs"}>{dateToElapsed(props.last_test)}</p>
        </div>

        {!props.seen && !isNewClicked &&
            <p className={"absolute rounded-full top-0 right-0 text-xs text-white px-1 text-center bg-red-500 opacity-85"}>new
                !</p>}
    </div>

    // return <div
    //     className={"flex flex-row items-center p-2 rounded-md bg-blue-950 text-white hover:bg-blue-900 cursor-pointer transition"}>
    //
    //     <div style={{width: "30px"}}>
    //         <CircularProgressbar value={props.score} strokeWidth={12} styles={
    //             buildStyles({
    //                 pathColor: props.score > 75 ? "green" : props.score > 50 ? "yellow" : props.score > 25 ? "orange" : "red",
    //                 trailColor: "rgba(255, 255, 255, 0.1)",
    //             })
    //         }/>
    //     </div>
    //     <p className={"text-xl ml-2 font-bold"}>{props.name}</p>
    // </div>
}

export default function MouliProjectSelector(props: {
    projects: EpiProject[],
    reload_projects: () => void,
    current_project: string | null
}): React.ReactElement {

    const [search, setSearch] = React.useState<string>("");

    const search_results = props.projects.filter((project) => project.project_name.toLowerCase().includes(search.toLowerCase()));

    return (

        <div
            className={"p-4 min-w-96 flex-grow overflow-y-auto sm:max-w-96 rounded-t-2xl shadow " + (props.current_project === null ? "" : "hidden xl:block")}>

            <input type="text" placeholder="Search..."
                   className={"w-full p-2 rounded-md bg-gray-100 text-gray-800 mt-2"}
                   onChange={(e) => setSearch(e.target.value)}/>

            <div className={"w-min"}>
                {search_results.filter((project) => !project.mouli_seen && project.mouli !== null).length > 0 ? (
                    <div
                        className={"flex select-none text-nowrap px-1 flex-row items-center justify-start gap-2 mt-2 bg-red-400 text-white rounded cursor-pointer hover:bg-red-500 transition"}
                        onClick={() => {
                            markAllProjectsAsSeen().then(() => {
                                props.reload_projects();
                            }).catch(() => console.error("Failed to mark all as read"));
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} className={"text-xs"}/>
                        <p className={"text-xs"}>mark all as read</p>
                    </div>) : null}

            </div>

            <div
                className={"grid grid-cols-2 gap-2 mt-2"}>
                {
                    search_results
                        .filter((project) => project.mouli !== null)
                        .map((project) => {
                            return <Project
                                project_name={project.project_name}
                                project_slug={project.project_slug}
                                score={project.mouli?.score!}
                                seen={project.mouli_seen}
                                key={project.project_slug}
                                is_warning={project.mouli?.is_warning}
                                last_test={new Date(project.mouli?.date!)}/>
                        })
                }
            </div>
        </div>
    )
}