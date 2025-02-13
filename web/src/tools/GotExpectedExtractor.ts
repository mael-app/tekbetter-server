import MouliGotExpected from "../models/MouliGotExpected";


const got_tag = "# Got:";
const expected_tag = "# But expected:";
const expected_end_tag = "# Test";

export default function extractGotExpected(mouli_trace: string): MouliGotExpected[] {

    let results: MouliGotExpected[] = [];
    if (!mouli_trace.includes(got_tag) || !mouli_trace.includes(expected_tag)) {
        return [];
    }


    let gots = mouli_trace.split(got_tag).slice(1);
    for (let i = 0; i < gots.length; i++) {
        if (!gots[i].includes(expected_tag))
            continue;
        if (!gots[i].split(expected_tag)[1].includes(expected_end_tag))
            continue;

        const got = gots[i].split(expected_tag)[0];
        const expected = gots[i].split(expected_tag)[1].split(expected_end_tag)[0];
        results.push(new MouliGotExpected(got, expected));
    }
    return results;
}
