import { useState, useEffect } from "react";
import useAuth from './useAuth';

const useAxios = (configObj) => {

    const { auth, setAuth } = useAuth();

    const {
        axiosInstance,
        method,
        url,
    } = configObj;

    //var configBeta = { ...requestConfig };

    const [response, setResponse] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);

    const refetch = () => setReload(prev => prev + 1);

    //HERE FOR TESTING, MUST BE REMOVED FOR PROD
    //function delay(milliseconds) {
    //    return new Promise(resolve => {
    //        setTimeout(resolve, milliseconds);
    //    });
    //}
    //await delay(500);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const res = await axiosInstance[method.toLowerCase()](url, {
                    signal: controller.signal
                });
                if (res.status === 401) {
                    auth.loggedIn = false;
                }
                setResponse(res.data);
                

            } catch (err) {
                setError(err.message);
                if (err?.response?.status === 401 || err?.response?.status === 403) {
                    localStorage.removeItem("loggedInLastSession");
                    const loggedIn = false;
                    setAuth({ loggedIn });
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        //useEffect cleanup function
        return () => controller.abort();

    }, [reload])

    return [response, error, loading, reload];
}

export default useAxios;