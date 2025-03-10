const Thresholds: { [key: number]: string } = {
    90: "green",
    70: "lightgreen",
    50: "yellow",
    25: "orange",
    0: "red",
}

function getColorCode(score: number) {
    for (const [threshold, color] of Object.entries(Thresholds).reverse()) {
        if (score >= Number(threshold)) {
            return color;
        }
    }
    return "red";
}


export default function scoreColor(score: number) {
    const code = getColorCode(score);
    let result = {
        tailwind: "",
        html: "",
    }

    if (code === "green") {
        result.tailwind = "bg-green-500";
        result.html = "green";
    } else if (code === "lightgreen") {
        result.tailwind = "bg-green-300";
        result.html = "lightgreen";
    } else if (code === "yellow") {
        result.tailwind = "bg-yellow-500";
        result.html = "#FFD700";
    } else if (code === "orange") {
        result.tailwind = "bg-orange-500";
        result.html = "orange";
    } else if (code === "red") {
        result.tailwind = "bg-red-500";
        result.html = "red";
    }

    return result;
}
