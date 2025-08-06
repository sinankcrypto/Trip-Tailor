import adminApi from "../../../api/adminApi";

export const getAllUsers = async () => {
    const response = await adminApi.get('/users/');
    return response.data;
};