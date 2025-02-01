import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowTrendDown,
    faArrowTrendUp, faBalanceScale,
    faCheckCircle,
    faCircleInfo,
    faClose,
    faHammer,
    faLineChart,
    faMagnifyingGlass,
    faSkull, faSquareArrowUpRight, faTerminal, faUserCheck,
    faWarning
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import MouliTestSkill from "./MouliTestSkill";
import Button from "../../comps/Button";
import {MouliResult} from "../../models/MouliResult";
import WindowElem, {BasicBox} from "../../comps/WindowElem";
import {dateToString} from "../../tools/DateString";
import ReactApexChart from "react-apexcharts";
import scoreColor from "../../tools/ScoreColor";
import LoadingComp from "../../comps/LoadingComp";
import ReactDiffViewer from "react-diff-viewer";
import MouliGotExpected from "../../models/MouliGotExpected";
import extractGotExpected from "../../tools/GotExpectedExtractor";

function TraceWindow(props: { content: string, close: () => void }) {
    return (
        <div>
            <div className={"absolute top-0 left-0 w-full h-full bg-black z-40 opacity-60"}/>

            <div className={"absolute w-full h-full top-0 left-0 flex z-50 justify-center items-center"}
                 onClick={(e) => props.close()}>
                <div className={"bg-gray-900 m-2 rounded-md p-2"} onClick={(e) => e.stopPropagation()}>
                    <div className={"flex flex-row items-start justify-between"}>
                        <FontAwesomeIcon icon={faTerminal}/>
                        <h1 className={"font-bold text-center text-xl mb-2"}>Details view</h1>
                        <FontAwesomeIcon className={"text-xl cursor-pointer"} icon={faClose}
                                         onClick={() => props.close()}/>
                    </div>

                    <div className={"bg-gray-800 p-2 rounded-md overflow-y-auto overflow-x-auto"} style={{
                        maxHeight: "calc(100vh - 12rem)",
                        maxWidth: "calc(100vw - 2rem)",
                        minHeight: "calc(50vh - 4rem)",
                        minWidth: "calc(50vw - 1rem)",
                    }}>
                        <code className={"text-xs"}>
                            {props.content.split("\n").map((line, index) => (
                                <div className={"text-gray-300 text-sm"} key={index}>{line}</div>
                            ))}
                        </code>
                    </div>
                    <div className={"flex flex-row justify-center mt-5"}>
                        <Button icon={faClose} text={"Close"} onClick={() => {
                            props.close();
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    );

}

function TextComparePopup(props: { instance: MouliGotExpected, close: () => void }) {

    return (
        <div>
            <div className={"absolute top-0 left-0 w-full h-full bg-black z-40 opacity-60"}/>

            <div className={"absolute w-full h-full top-0 left-0 flex z-50 justify-center items-center"} onClick={() => props.close()}>
                <div className={"bg-gray-100 m-2 rounded-md p-2"} onClick={(e) => e.stopPropagation()}>
                    <div className={"flex flex-row items-start justify-between"}>
                        <FontAwesomeIcon icon={faBalanceScale}/>
                        <h1 className={"font-bold text-center text-xl mb-2"}>Result comparator</h1>
                        <FontAwesomeIcon className={"text-xl cursor-pointer"} icon={faClose}
                                         onClick={() => props.close()}/>
                    </div>

                    <div className={"p-2 rounded-md overflow-y-auto overflow-x-auto"} style={{
                        maxHeight: "calc(100vh - 12rem)",
                        maxWidth: "calc(100vw - 2rem)"
                    }}>
                        <ReactDiffViewer
                            leftTitle={"Got"}
                            showDiffOnly={false}
                            rightTitle={"Expected"}
                            oldValue={props.instance.got}
                            newValue={props.instance.expected}
                            splitView={true}

                            styles={{
                                contentText: {
                                    minWidth: "100px",
                                    fontSize: "13px",
                                },
                                lineNumber: {
                                    textAlign: "right",
                                },
                            }}
                        />

                    </div>
                    <div className={"flex flex-row justify-center mt-5"}>
                        <Button icon={faClose} text={"Close"} onClick={() => {
                            props.close();
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    );

}

function TopProp(props: { children: React.ReactNode, title: string, icon: any, isOk?: boolean }) {

    const icon = (is_ok: boolean) => {
        return <FontAwesomeIcon icon={is_ok ? faCheckCircle : faWarning} color={is_ok ? "green" : "red"}/>
    }

    return <div
        className={"flex flex-col border-l-2 border-gray-200 pl-2 m-1 shadow-sm rounded hover:bg-gray-100 transition"}>
        <div className={"flex flex-row items-center justify-between gap-2 p-2"}>
            <div className={"flex flex-row items-center gap-1"}>
                <FontAwesomeIcon icon={props.icon}/>
                <h2 className={"font-bold text-nowrap"}>{props.title}</h2>
            </div>
            {icon(props.isOk === undefined ? true : props.isOk)}
        </div>
        {props.children}
    </div>
}

function ElemStatus(props: { err_content: any }) {
    return !props.err_content ? (
        <div className={""}>
            <p className={"italic opacity-70"}>No issues found</p>
        </div>
    ) : (
        <div
            className={"flex max-w-64 flex-row items-center border rounded border-red-400 bg-red-200 text-gray-500 gap-1 pl-1"}>
            <FontAwesomeIcon icon={faCircleInfo} color={"red"}/>
            <p>{props.err_content}</p>
        </div>
    );
}

function MouliChart(props: { scores: number[], dates: string[] }) {


    const replace_date = (date: string) => {
        return date.split("T")[0];
    }

    return (
        <ReactApexChart
            className={"w-full"}
            options={{
                chart: {
                    id: "basic-bar",
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false
                    },
                    selection: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    labels: {
                        show: false,
                    },
                },
                xaxis: {
                    categories: props.dates.map(replace_date),
                    labels: {
                        show: false,
                    },
                },

                stroke: {
                    show: true,
                    width: 2,
                }
            }}
            series={[
                {
                    name: "Result",
                    data: props.scores,
                },
            ]}
            type="area"
            height={130}
        />
    );

}


export default function MouliContent(props: { mouli: MouliResult | null }): React.ReactElement {

    const [popupValue, setPopupValue] = React.useState<string | null>(null);
    const [textCompareData, setTextCompareData] = React.useState<MouliGotExpected | null>(null);

    const mouli = props.mouli;

    if (!mouli) {
        return <LoadingComp/>
    }

    let scores = mouli.evolution.scores
    let evo_ids = mouli.evolution.ids
    let id_index = evo_ids.indexOf(mouli.test_id)
    scores = scores.slice(0, id_index)

    let evolution = mouli.total_score
    let gotExpecteds = extractGotExpected(mouli.build_trace || "");


    if (scores.length > 0)
        evolution = mouli.total_score - scores[scores.length - 1]


    return (
        <WindowElem
            title={<h1 className={"font-bold text-center text"}>{mouli.project_name} test results</h1>}>
            <div className={"p-2 text"}>

                {popupValue && <TraceWindow content={popupValue} close={() => setPopupValue(null)}/>}
                {textCompareData &&
                    <TextComparePopup instance={textCompareData} close={() => setTextCompareData(null)}/>}

                <div className={"flex flex-row justify-between texts"}>
                    <div className={"flex flex-row justify-between w-full"}>
                        <div className={"flex flex-col gap-2 p-2 rounded-md w-full"}>
                            {/*<BasicBox className="flex flex-row w-full sm:w-[calc(40%-0.5rem)]">*/}

                            <div className={"flex flex-col xl:flex-row justify-between gap-2 w-full"}>

                                <BasicBox className={"min-w-72 flex flex-row items-center"}>
                                    <div className={"flex flex-row items-center gap-2 h-min"}>
                                        <div className={"w-20 z-10"}>
                                            <CircularProgressbar
                                                value={mouli.total_score}
                                                text={`${mouli.total_score}%`}
                                                strokeWidth={8}

                                                styles={buildStyles({
                                                    textColor: scoreColor(mouli.total_score).html,
                                                    pathColor: scoreColor(mouli.total_score).html,
                                                    trailColor: "rgba(0,0,0,0.09)",
                                                })}
                                            />
                                        </div>
                                        <div className={"flex flex-col justify-center"}>
                                            <p>Commit: {mouli.commit}</p>
                                            <p>Test date: {dateToString(mouli.test_date)}</p>
                                            <p>Test n°{mouli.test_id}</p>
                                            <ElemStatus
                                                err_content={mouli.delivery_error ? "Delivery Error" : mouli.isManyMandatoryFailed() ? "Mandatory failed" : mouli.is_build_failed ? "Build failed" : null}
                                            />
                                            <div className={"flex flex-row gap-2 justify-start mt-1"}>

                                                {mouli.build_trace && (
                                                    <Button
                                                        icon={faTerminal}
                                                        text={"Console"}
                                                        onClick={() => setPopupValue(mouli.build_trace)}
                                                    />
                                                )}{mouli.make_trace && (
                                                <Button
                                                    icon={faHammer}
                                                    text={"Build"}
                                                    onClick={() => setPopupValue(mouli.make_trace)}
                                                />
                                            )}
                                            </div>

                                        </div>
                                    </div>
                                </BasicBox>

                                <BasicBox className={"flex flex-row flex-grow justify-center"}>
                                    <MouliChart scores={mouli.evolution.scores} dates={mouli.evolution.dates}/>
                                </BasicBox>
                            </div>

                            <div className={"flex flex-row gap-2"}>
                                <BasicBox className="flex-grow w-full sm:w-[calc(50%-0.5rem)]">
                                    <div className={"grid grid-cols-1 sm:grid-cols-2 grid-rows-2"}>
                                        <TopProp title={"Banned functions"} icon={faHammer}
                                                 isOk={mouli.banned_content === null}>
                                            <p className={"italic opacity-95 text-red-300 font-bold"}>{mouli.banned_content}</p>
                                        </TopProp>

                                        <TopProp title={"Coding style"} icon={faMagnifyingGlass}>
                                            {/*<div className={"px-1"}>*/}
                                            {/*    <ElemStatus*/}
                                            {/*        err_content={mouli.coding_style.isPerfect() ? null : (*/}
                                            {/*            <div>*/}
                                            {/*                <CodingStyleRow name={"MAJOR"}*/}
                                            {/*                                value={mouli.coding_style.major_count}/>*/}
                                            {/*                <CodingStyleRow name={"MINOR"}*/}
                                            {/*                                value={mouli.coding_style.minor_count}/>*/}
                                            {/*                <CodingStyleRow name={"INFO"}*/}
                                            {/*                                value={mouli.coding_style.info_count}/>*/}
                                            {/*            </div>*/}
                                            {/*        )}*/}
                                            {/*    />*/}
                                            {/*</div>*/}
                                            <p className={"italic text-yellow-400"}>Feature not implemented yet</p>
                                        </TopProp>

                                        <TopProp title={"Crash verification"} icon={faSkull}
                                                 isOk={!mouli.isCrashed()}

                                        >
                                            <div className={"px-1"}>
                                                <ElemStatus
                                                    err_content={mouli.isCrashed() ? `${mouli.crashCount()} tests crashed` : null}
                                                />
                                            </div>
                                        </TopProp>

                                        <TopProp title={"Evolution"} icon={faLineChart}>
                                            <div className={"px-1 flex flex-row items-center gap-2"}>
                                                <FontAwesomeIcon
                                                    icon={evolution >= 0 || mouli.total_score === 100 ? faArrowTrendUp : faArrowTrendDown}
                                                    color={evolution >= 0 || mouli.total_score === 100 ? "green" : "red"}/>
                                                <p className={"font-bold " + ((evolution >= 0 || mouli.total_score === 100) ? "text-green-500" : "text-red-500")}>
                                                    {Math.round(evolution)}%</p>
                                            </div>
                                        </TopProp>
                                        {
                                            (mouli.coverage_branches && mouli.coverage_lines) && (mouli.coverage_branches + mouli.coverage_lines) > 0 ?

                                                <TopProp title={"Unit tests coverage"} icon={faUserCheck}>
                                                    <div
                                                        className={"px-1 flex flex-row items-center justify-around p-1 gap-2"}>
                                                        <div className={"flex flex-col items-center"}>
                                                            <p>Lines</p>

                                                            <div className={"w-16 z-10"}>
                                                                <CircularProgressbar
                                                                    value={mouli.coverage_lines!}
                                                                    text={`${mouli.coverage_lines!}%`}
                                                                    strokeWidth={8}

                                                                    styles={buildStyles({
                                                                        textColor: scoreColor(mouli.coverage_lines!).html,
                                                                        pathColor: scoreColor(mouli.coverage_lines!).html,
                                                                        trailColor: "rgba(0,0,0,0.09)",
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={"flex flex-col items-center"}>
                                                            <p>Branches</p>

                                                            <div className={"w-16 z-10"}>
                                                                <CircularProgressbar
                                                                    value={mouli.coverage_branches!}
                                                                    text={`${mouli.coverage_branches!}%`}
                                                                    strokeWidth={8}

                                                                    styles={buildStyles({
                                                                        textColor: scoreColor(mouli.coverage_branches!).html,
                                                                        pathColor: scoreColor(mouli.coverage_branches!).html,
                                                                        trailColor: "rgba(0,0,0,0.09)",
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TopProp> : null
                                        }
                                        {
                                            (gotExpecteds.length > 0 ? (

                                                <TopProp title={"Got/Expected"} icon={faBalanceScale}>
                                                    <div
                                                        className={"px-1 flex flex-row items-center justify-around p-1 gap-2"}>
                                                        {gotExpecteds.map((instance, index) => (
                                                            <Button
                                                                key={index}
                                                                text={"Compare"}
                                                                icon={faSquareArrowUpRight}
                                                                onClick={() => setTextCompareData(instance)}
                                                            />
                                                        ))}
                                                    </div>
                                                </TopProp>
                                            ) : null)
                                        }
                                    </div>
                                </BasicBox>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={"texts"}>
                    <h1>Tests</h1>
                    <div className={"space-y-2"}>
                        {mouli.skills.map(skill => <MouliTestSkill skill={skill} setPopupValue={setPopupValue}/>)}
                    </div>
                </div>

            </div>
        </WindowElem>

    )
}