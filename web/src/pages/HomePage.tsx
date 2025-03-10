import React, {useEffect} from "react";
import TopBar from "../comps/TopBar";
import {useNavigate} from "react-router";

export default function HomePage(): React.ReactElement {
    const nav = useNavigate();

    useEffect(() => {
        nav("/moulinettes");
    }, []);
    return <div></div>;
}