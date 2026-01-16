import apiClient from "../../../../api/apiClient";

export const getProfile = async () => {
    const res = await apiClient.get("user/profile/");
    return res.data;
}

export const createProfile = async (payload) => {
    const res = await apiClient.post("user/profile/", payload, {
        headers: {"Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export const updateProfile= async (payload) => {
    const res = await apiClient.put("user/profile/", payload, {
        headers: {"Content-Type": "multipart/form-data" },
    })
    return res.data;
}

export const createUserInterests = async ({ interest_ids }) => {
    const res = await apiClient.post("/recommendations/interests/user/", { interest_ids })
    return res.data;
}

export const getUserInterests = async () => {
    const res = await apiClient.get("/recommendations/interests/user/");
    return res.data;
};
