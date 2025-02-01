import React, {useEffect} from "react";
import 'react-circular-progressbar/dist/styles.css';
import MouliContent from "./MouliContent";
import MouliHistory from "./MouliHistory";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import {dateToElapsed} from "../../tools/DateString";
import {MouliResult} from "../../models/MouliResult";
import getAllProjects, {markAllProjectsAsSeen, markProjectAsSeen} from "../../api/project.api";
import {EpiProject} from "../../models/Project";
import {getMouliDetails, getProjectMouliHistory} from "../../api/mouli.api";
import {useNavigate, useParams} from "react-router";
import scoreColor from "../../tools/ScoreColor";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faWarning} from "@fortawesome/free-solid-svg-icons";
import LoadingComp from "../../comps/LoadingComp";
import MouliProjectSelector from "./MouliProjectSelector";


export default function MouliPage(): React.ReactElement {

    const [projects, setProjects] = React.useState<EpiProject[] | null>(null);

    const [current_mouli, setCurrentMouli] = React.useState<MouliResult | null>(null);
    const [project_slug, setProjectSlug] = React.useState<string | null>(null);

    const [history, setHistory] = React.useState<{
        test_id: number;
        score: number;
        date: Date;
        is_warning: boolean;
    }[] | null>(null);

    const params = useParams();
    const c_project_slug = params.project_slug || null;


    const load_test = (test_id: number) => {
        if (test_id === current_mouli?.test_id)
            return;
        setCurrentMouli(null);
        getMouliDetails(test_id).then((r) => {
            setCurrentMouli(r);
        });
    }
    const navigate = useNavigate();

    const reload_projects = () => {
        getAllProjects().then((data) => {
            setProjects(data.sort((a, b) => a.start_date > b.start_date ? -1 : 1));
        }).catch((e) => {
            console.error("Failed to load projects", e);
        });
    }

    useEffect(() => {
        reload_projects();
        const interval = setInterval(reload_projects, 1000 * 40);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {

        if (c_project_slug !== project_slug) {
            setHistory(null);
            getProjectMouliHistory(c_project_slug!).then((data) => {
                setHistory(data);
                const sorted_data = data.sort((a, b) => a.date > b.date ? -1 : 1);
                setProjectSlug(c_project_slug);
                if (data.length > 0)
                    load_test(sorted_data[0].test_id);
            });
        }
    }, [c_project_slug, project_slug]);

    if (projects === null)
        return <LoadingComp/>

    return (
        <div>
            <div className={"flex flex-row p-5 text"} style={{
                height: "calc(100vh - 130px)",
            }}>

                <MouliProjectSelector projects={projects} reload_projects={reload_projects} current_project={project_slug}/>

                {
                    project_slug == null ? null :
                        <div className={"overflow-y-auto flex-grow"}>
                            <div className={"flex flex-row items-center gap-2  xl:hidden"}
                                 onClick={() => navigate("/moulinettes")}>
                                <FontAwesomeIcon icon={faChevronLeft} className={"ml-2"}/>
                                <h1 className={"text-2xl font-bold ml-2"}>{project_slug}</h1>
                            </div>
                            <div className={"flex flex-col xl:flex-row  justify-start w-full gap-3 "}>
                                <div className={"xl:w-96 w-full h-64 xl:h-full p-2"}>
                                    <MouliHistory history={history || []} selected={current_mouli?.test_id || -1}
                                                  onSelect={(new_id: number) => load_test(new_id)}/>
                                </div>

                                <div className={"flex-grow flex-1"}>
                                    <MouliContent mouli={current_mouli}/>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}