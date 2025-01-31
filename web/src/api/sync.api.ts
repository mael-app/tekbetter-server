import api from "./api";

export async function deleteMicrosoftToken() {
    const res = await api.delete(`/sync/microsoft`);
    if (res.status === 200) alert("Microsoft token deleted successfully");
}

export async function putMicrosoftToken(token: string) {
    const res = await api.post(`/sync/microsoft`, {
        token: token
    });
    if (res.status === 200) alert("Microsoft token saved successfully. Please wait a few minutes for the sync to complete.");
}
