import userApi from "../../../../api/userApi";

export const getProfile = async () => {
    const res = await userApi.get("profile/");
    return res.data;
}

export const createProfile = async (payload) => {
    const res = await userApi.post("profile/", payload, {
        headers: {"Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export const updateProfile= async (payload) => {
    const res = await userApi.put("profile/", payload, {
        headers: {"Content-Type": "multipart/form-data" },
    })
    return res.data;
}