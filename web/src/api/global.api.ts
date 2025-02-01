import api, {vars} from "./api";
import StudentData from "../models/StudentData";

export async function getSyncStatus(): Promise<{
    mouli: Date | null,
    planning: Date | null,
    projects: Date | null,
}> {
    const res = await api.get(`/global/sync-status`);
    return {
        mouli: res.data.mouli ? new Date(res.data.mouli) : null,
        planning: res.data.planning ? new Date(res.data.planning) : null,
        projects: res.data.projects ? new Date(res.data.projects) : null,
    }
}

export async function getStudentData(id: string): Promise<StudentData> {

    let results = vars.studentsCache.filter(student => student.id === id);
    console.log("results", results);

    if (results.length === 1) {
        return results[0];
    }

    const res = await api.get(`/student/${id}`);
    const student = new StudentData(res.data);
    vars.studentsCache.push(student);
    return student;

}
