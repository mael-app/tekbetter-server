import api from "./api";
import {EpiProject} from "../models/Project";
import {EpiModule} from "../models/Module";

export default async function getModules(): Promise<{ modules: EpiModule[], credits: number, current_year: number, required_credits: number, current_year_id: number, gpa: number | null }> {
    const res = await api.get(`/modules`);
    const modules = res.data.modules.map((module: any) => new EpiModule(module));
    return {
        modules: modules,
        credits: res.data.credits,
        current_year: res.data.current_year,
        current_year_id: res.data.current_year_id,
        required_credits: res.data.required_credits,
        gpa: res.data.gpa || -1
    }
}