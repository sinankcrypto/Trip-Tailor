import apiClient from "../../../api/apiClient"

export const markNotficationRead = async (id) => {
    const res = await apiClient.post(`/notifications/${id}/mark_read/`);
    return res.data
};

export const MarkAllNotificationsRead = async () => {
    const res = await apiClient.post("/notifications/mark_all_as_read/");
    return res.data
}