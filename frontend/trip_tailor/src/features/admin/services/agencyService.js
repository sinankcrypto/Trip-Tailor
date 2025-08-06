import adminApi from "../../../api/adminApi";

export const getAllAgencies = async () => {
    const response = await adminApi.get('/agencies/')
    return response.data;
}