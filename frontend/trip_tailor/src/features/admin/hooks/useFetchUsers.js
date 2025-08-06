import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

export const useFetchUsers = () => {
    const [users, setUsers] =  useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally{
                setLoading(false);
            }
        };

        fetchUsers();
    },[])

    return { users, loading}
};