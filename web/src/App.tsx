import './App.css';
import {Route, Routes} from "react-router-dom";
import React, {useEffect} from "react";
import HomePage from "./pages/HomePage";
import MouliPage from "./pages/mouli/MouliPages";
import TopBar from "./comps/TopBar";
import "./assets/styles/base.css"
import CalendarPage from "./pages/CalendarPage";
import SyncPage from "./pages/SyncPage";
import AuthPage from "./pages/AuthPage";
import FullError from "./comps/FullError";
import {vars} from "./api/api";
import Footer from "./comps/Footer";
import ModulePage from "./pages/module/ModulePage";
import {useCallback} from "react";

import Particles from "react-tsparticles";
import {loadFull} from "tsparticles";
import MyParticles from "./comps/MyParticles";

function App() {

    const [error, setError] = React.useState<{
        title?: string,
        message?: string
    } | null>(null);

    useEffect(() => {
        vars.setErrorPopup = (title: string | null, message: string | null) => {
            setError({
                title: title || "An error occured",
                message: message || "An error occured, please try again later."
            });
        }
    }, []);

   // return <MyParticles/>


    return (
        <div className={"h-screen flex flex-col"}>
            {/*<MyParticles/>*/}

            <TopBar/>
            {error && <FullError title={error.title} message={error.message}/>}
            <div className={"overflow-y-auto h-screen p-1"}>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route path="/calendar" element={<CalendarPage/>}/>
                    <Route path="/sync" element={<SyncPage/>}/>
                    <Route path="/moulinettes" element={<MouliPage/>}/>
                    <Route path="/modules" element={<ModulePage/>}/>
                    <Route path="/moulinettes/:project_slug"
                           element={<MouliPage/>}/>
                </Routes>
            </div>
            <div>
                <Footer/>
            </div>

        </div>
    );
}

export default App;
