import apiClient from "../../../api/apiClient"

export const getMyPackages = async () => {
    const res = await apiClient.get("packages/my-packages");
    return res.data;
};

export const getPackage = async (id) => {
    const res = await apiClient.get(`packages/${id}`);
    return res.data;
};

export const createPackage = async (FormData) => {
    const res = await apiClient.post("packages/create", FormData, {
        headers: { "Content-Type": "multipart/form-data"},
    });
    return res.data
};

export const updatePackage = async (id, FormData) => {
    const res = await apiClient.patch(`packages/${id}/update`, FormData, {
        headers: { "Content-Type": "multipart/form-data"}
    });
};

export const toggleList = async (id) => {
    const res = await apiClient.patch(`packages/${id}/toggle-list`);
    return res.data;
};

export const deletePackage = async (id) => {
    const res = await apiClient.delete(`packages/${id}/delete`);
    return res.data;
};

export const getPackages = async () => {
    const res = await apiClient.get("/packages/")
    return res.data
}

export const getLatestPackages = async () => {
    const res = await apiClient.get("/packages/latest/")
    return res.data;
};