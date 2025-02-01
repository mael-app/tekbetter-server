import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCodeBranch, faTree, faXmarkCircle} from "@fortawesome/free-solid-svg-icons";
import GithubLogo from "../assets/githublogo.svg";

export default function Footer(): React.ReactElement {

    const commit_hash = process.env.REACT_APP_COMMIT_HASH || "dev";

    return <footer className={"flex flex-row justify-between bg-gray-800 text p-2"}>


            <div className={"flex flex-row items-center cursor-pointer gap-0.5"} onClick={() => {
                window.open("https://github.com/EliotAmn/tekbetter-server", "_blank");
            }}>
                <FontAwesomeIcon icon={faCodeBranch}/>
                <p>
                    version: {commit_hash}
                </p>

            </div>
            <div className={"flex flex-row items-center cursor-pointer gap-0.5"}>
                <a href="https://discord.gg/kSgKYgUUzc" target="_blank" rel="noreferrer">
                    Join our Discord
                </a>

            </div>


        <p className={"text-center hidden sm:block"}>
            Made with ❤️ by Epitech students :)
        </p>
    </footer>
}