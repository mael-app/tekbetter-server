import React from "react";
import {buildStyles, CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faWarning,
} from "@fortawesome/free-solid-svg-icons";
import {dateToElapsed, dateToString} from "../../tools/DateString";
import WindowElem from "../../comps/WindowElem";
import scoreColor from "../../tools/ScoreColor";
import LoadingComp from "../../comps/LoadingComp";

function MouliHistoryItem(props: {
    test_id: number,
    date: Date,
    score: number,
    is_selected: boolean,
    is_warning: boolean,
    onOpen: () => void
}): React.ReactElement {

    const mouli = {
        total_score: props.score,
        test_date: props.date,
    }

    return <div
        className={"flex relative text flex-row justify-between items-center p-2 rounded-md shadow hover:bg-gray-100 cursor-pointer transition mb-1 min-w-52"}
        onClick={props.onOpen}
    >

        <div className={"flex flex-row gap-2 items-center"}>
            <div style={{width: "30px"}}>
                <CircularProgressbar value={mouli.total_score} strokeWidth={12} styles={
                    buildStyles({
                        textColor: scoreColor(props.score).html,
                        pathColor: scoreColor(mouli.total_score).html,
                        trailColor: "rgba(0,0,0,0.07)",
                    })
                }/>
            </div>
            <FontAwesomeIcon icon={faWarning} className={"text-red-500 text-xs " + (props.is_warning ? "" : "hidden")}/>
        </div>
        <p className={"font-bold text-sm"}>{dateToString(mouli.test_date)}</p>

        <div className={"absolute right-1 bottom-0 text-xs italic text-gray-300 flex flex-row gap-2"}>
            <p className={""}>{dateToElapsed(mouli.test_date)}</p>
        </div>


        <div className={"flex flex-row gap-2"}>
            {/*{mouli.isCrashed() && <FontAwesomeIcon icon={faSkull} title={"Crashed"} color={"red"}/>}*/}
            {/*{(mouli.isManyMandatoryFailed() || mouli.banned_content !== null) &&*/}
            {/*    <FontAwesomeIcon icon={faWarning} title={"Problems found"} color={"red"}/>}*/}
        </div>
        <div style={{width: "10px"}}>
            <FontAwesomeIcon icon={faArrowRight} className={"transition " + (props.is_selected ? "" : "hidden")}/>
        </div>
    </div>
}


export default function MouliHistory(props: {
    history: {
        test_id: number,
        score: number,
        is_warning: boolean,
        date: Date
    }[], selected: number,
    onSelect: (test_id: number) => void
}): React.ReactElement {
    return (
        <WindowElem
            title={<h1 className={"font-bold text-center text"}>Tests history</h1>}
            className={"h-full overflow-y-auto min-w-80"}
        >
            <div className={"p-2 "}>
                <div className="p-1">

                    {props.history.length === 0 ? <LoadingComp/> : props.history
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((mouli, index) =>
                            [...Array(1)].map((_, idx) => (
                                <MouliHistoryItem
                                    key={`${index}-${idx}`}
                                    test_id={mouli.test_id}
                                    date={mouli.date}
                                    score={mouli.score}
                                    is_warning={mouli.is_warning}
                                    is_selected={mouli.test_id === props.selected}
                                    onOpen={() => props.onSelect(mouli.test_id)}
                                />
                            ))
                        )}
                </div>
            </div>

        </WindowElem>
    );
}