import React from "react";

export default function WindowElem(props: { title: React.ReactNode, className?: string,  children: React.ReactNode }) {
    return <div className={"flex flex-col dark:border-gray-700 border-gray-200 border shadow rounded-t-2xl " + (props.className ? props.className : "")}>
        <div className={"p-2 border-b dark:border-gray-700 border-gray-200 rounded-t-2xl"}>
            <h2 className={"font-bold"}>{props.title}</h2>
        </div>
        <div className={"h-full"}>
            {props.children}
        </div>
    </div>
}

export function BasicBox(props: { children: React.ReactNode, className?: string }) {
   return  <div className={("rounded-2xl p-2 text shadow-sm ") + (props.className ? props.className : "")}>
        {props.children}
    </div>
}