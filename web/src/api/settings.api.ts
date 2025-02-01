import api, {vars} from "./api";
import StudentData from "../models/StudentData";

export async function getSettings(): Promise<{
    share_enabled: boolean,
}> {


    const res = await api.get(`/settings`);
    return {
        share_enabled: res.data.share_enabled,
    }
}

export async function putSettings(data: {
    share_enabled: boolean,
}): Promise<void> {


    await api.put(`/settings`, data);
}
