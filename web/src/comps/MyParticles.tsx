import React from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSnowPreset } from "tsparticles-preset-snow";

export default function MyParticles(): React.ReactElement {

    const customInit = async (main: Engine) => {
        await loadSnowPreset(main);
    };

    const options = {
        //preset: "snow",
        background: {
            color: "#131313",
        },
    };

    return <Particles options={options} init={customInit} />;

}