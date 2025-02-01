import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faChevronDown,
    faChevronRight, faSkull, faWarning, faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import {MouliSkill, MouliTestClass} from "../../models/MouliResult";
import scoreColor from "../../tools/ScoreColor";
import PersonsButton from "../../models/PersonsButton";

function MouliTest(props: { test: MouliTestClass, setPopupValue: (value: string) => void }): React.ReactElement {
    const test = props.test;

    const color = test.is_passed ? "text-green-500" : "text-red-400";



    return <div className={"flex flex-row items-center gap-1 p-2 rounded-md text-gray-500"}>
        <FontAwesomeIcon icon={test.is_crashed ? faSkull : test.is_passed ? faCheckCircle : faXmarkCircle}
                         className={color}/>

        {test.passed_students && <PersonsButton students_ids={test.passed_students}/>}
        <p className={"font-bold text-nowrap"}>{test.name}</p>
        {/*<p className={`font-bold ${test.is_passed ? "text-green-600" : "text-red-500"}`}>{test.is_crashed ? "CRASH" : test.is_passed ? "Passed" : "FAIL"}</p>*/}
        <div className={"flex flex-row items-center ml-2"}>
            <p className={"hidden xl:block text-gray-400 pl-1 border-opacity-0 hover:border-opacity-100 border-l-2 border-l-gray-300"}>
                {test.comment}
            </p>
            <p className={"xl:hidden text-gray-400 pl-1 border-opacity-0 hover:border-opacity-100 border-l-2 border-l-gray-300"} onClick={() => {
                props.setPopupValue(test.comment!)
            }}>
                - Show -
            </p>
        </div>

    </div>
}

export default function MouliTestSkill(props: { skill: MouliSkill, setPopupValue: (value: string) => void }): React.ReactElement {

    const skill = props.skill
    const [isExpanded, setIsExpanded] = React.useState(true);

    return <div className={""}>
        <div
            className={"border-gray-100 border-2 text w-full hover:bg-gray-100 transition cursor-pointer flex flex-row justify-between items-center gap-2 p-1 rounded-t"}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className={"flex flex-row items-center"}>

                <div className={"flex flex-row items-center gap-2 p-2 w-6"}>
                    <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight}/>

                </div>
                <h2 className={"ml-3"}>{skill.title}</h2>
                {skill.isWarning() && <FontAwesomeIcon icon={faWarning} className={"ml-1 text-red-500"}/>}
            </div>


            <div className={"flex flex-row items-center gap-1"}>
                <p className={"text-right font-bold"} style={{color: scoreColor(skill.score).html}}>{skill.score}%</p>
                <div className={"w-24 xl:w-60"}>
                    <ProgressBar height={"10px"} baseBgColor={"rgba(0,0,0,0.09)"} completed={skill.score}
                                 bgColor={scoreColor(skill.score).html} isLabelVisible={false}/>
                </div>
                { skill.passed_students && <PersonsButton students_ids={skill.passed_students!}/>}

            </div>
        </div>

        <div className={`${isExpanded ? "block" : "hidden"} bg-gray-100 p-2 rounded-b`}>
            <div className={"flex flex-row items-center justify-between gap-2"}>
                <p className={"text-gray-500"}>Passed: {skill.tests_passed_count} of {skill.tests_count}</p>
                {skill.tests_crashed_count > 0 ?
                    <p className={"text-red-500 font-bold"}>Crashs: {skill.tests_crashed_count}</p> : null}
                {skill.mandatory_failed_count > 0 ?
                    <p className={"text-red-500 font-bold"}>Mandatory Fail: {skill.mandatory_failed_count}</p> : null}
            </div>

            {
                skill.tests === null ? null : skill.tests.map((test, index) => <MouliTest setPopupValue={props.setPopupValue} key={index} test={test}/>)
            }
        </div>
    </div>
}