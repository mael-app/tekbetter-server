import api from "./api";

export async function getLoginStatus(email: string): Promise<"login" | "register"> {
    const res = await api.post(`/auth/email`, {
        email: email
    });
    if (res.data.status === "login" || res.data.status === "register") {
        return res.data.status;
    }
    return "login";
}

export async function isValidTicket(ticket: string): Promise<boolean> {
    const res = await api.post(`/auth/ticket`, {
        ticket: ticket
    });
    return res.status === 200;
}

export async function loginWithPassword(email: string, password: string): Promise<boolean> {
    const res = await api.post(`/auth/login`, {
        email: email,
        password: password
    });
    if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem("auth", token);
        window.location.href = "/";
    }
    return res.status === 200;
}

export async function resetPassword(email: string): Promise<boolean> {
    const res = await api.post(`/auth/reset`, {
        email: email
    });
    return res.status === 200;
}

export async function changePasswordRequest(oldPassword: string, newPassword: string): Promise<boolean> {
    const res = await api.post(`/auth/change`, {
        oldPassword: oldPassword,
        newPassword: newPassword
    });
    return res.status === 200;
}

export async function registerWithTicket(ticket: string, password: string): Promise<boolean> {
    const res = await api.post(`/auth/register`, {
        ticket: ticket,
        password: password
    });
    if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem("auth", token);
        window.location.href = "/";
    }
    return res.status === 200;
}