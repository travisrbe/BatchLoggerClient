import { useState, useEffect } from "react";
import useAuth from './useAuth';

const useAxiosFunction = () => {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState();

    const { auth, setAuth } = useAuth();

    //Check out caching
    //HERE FOR TESTING, MUST BE REMOVED FOR PROD
    //function delay(milliseconds) {
    //    return new Promise(resolve => {
    //        setTimeout(resolve, milliseconds);
    //    });
    //}
    //await delay(500);

    const axiosFetch = async (configObj) => {
        const {
            axiosInstance,
            method,
            url,
            data,
        } = configObj;

        try {
            setLoading(true);
            setResponse('');
            const ctrl = new AbortController();
            setController(ctrl);
            var resp;
            if (data) {
                resp = await axiosInstance[method.toLowerCase()](url, data, {
                    signal: ctrl.signal
                })
            }
            else {
                resp = await axiosInstance[method.toLowerCase()](url, {
                    signal: ctrl.signal
                })
            }
            const res = resp; //hacky way to return immutable
            setResponse(res.data);
            if (resp.status === 401 || resp.status === 403) {
                console.log(url + " " + resp.status)
            }
            setError(false);
        } catch (err) {
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                localStorage.removeItem("loggedInLastSession");
                const loggedIn = false;
                setAuth({ loggedIn });
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        return () => controller && controller.abort();
    }, [controller])

    return [response, error, loading, axiosFetch];
}

export default useAxiosFunction;