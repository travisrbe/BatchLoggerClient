import * as React from 'react';
import axios from '../../apis/axios';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Header from '../shared/Header';
import Authorized from '../authorized/Authorized';
import { NuAddsProvider } from '../../Context/NuAddsContext';
import useAuth from '../../hooks/useAuth';

import {
    CircularProgress,
    Toolbar,
    Grid,
} from '@mui/material/';

export default function SignInWrapper() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [rememberMe, setRememberMe] = React.useState(true);
    const [registerToggle, setRegisterToggle] = React.useState(false);
    const [userId, setUserId] = React.useState("");
    const [userChosenName, setUserChosenName] = React.useState("");
    const [userEmail, setUserEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const { setAuth, auth } = useAuth();

    const BASE_URL = 'https://localhost:7041/api/';
    //const BASE_URL = 'https://api-cellarnotes-eastus-dev01.azurewebsites.net/api/';

    const toggleRegister = () => {
        console.log("Setting registerToggle to: " + !registerToggle);
        setRegisterToggle(!registerToggle);
        setErrorMessage(null);
    }
    const toggleRememberMe = () => {
        console.log("Setting rememberMe to: " + !rememberMe);
        setRememberMe(!rememberMe);
    }

    const getUserDto = async (e) => {
        let loggedIn = false;
        let userName = '';
        await axios.get(
            BASE_URL + "Users/Current",
            { withCredentials: true }
        ).then((response) => {
            if (response.status === 200) {
                setUserId(response.data.id);
                setUserChosenName(response.data.chosenName);
                userName = response.data.chosenName;
                setUserEmail(response.data.email);
                loggedIn = true;
                setErrorMessage(null);
            }
        }).catch((response) => {
            console.log(response);
        }).finally(() => {
            setAuth({ loggedIn, userName });
            localStorage.setItem("loggedInLastSession", loggedIn);
        });
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post(
            //"https://localhost:7041/api/account/login",
            BASE_URL + 'account/login/',
            {
                email,
                password
            },
            {
                headers: {
                    'content-type': 'application/json',
                },
                withCredentials: true,
                params: {
                    useCookies: rememberMe,
                    useSessionCookies: !rememberMe
                }
            }).then((resp) => {
                if (resp.status == 200) {
                    getUserDto();
                }
            }).catch((resp) => {
                setErrorMessage("Sign in failed.");
                setLoading(false);
            });
    }
    //React.useEffect(() => {
    //    getUserDto();
    //}, []);

    return (
        loading
            ?
            <React.Fragment>
                <Toolbar />
                <Toolbar />
                <Grid container align="center" justifyContent="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>  
            </React.Fragment>
            :
            (auth.loggedIn == false || userChosenName === "" || localStorage.getItem("loggedInLastSession") != 'true') ?
                registerToggle ?
                    <React.Fragment>
                        <SignUp
                            onToggleRegister={toggleRegister}
                        />
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <Toolbar/>
                        <SignIn
                            onSubmit={handleSubmit}
                            email={email}
                            password={password}
                            rememberMe={rememberMe}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onRememberMeChange={toggleRememberMe}
                            onToggleRegister={toggleRegister}
                            errorMessage={errorMessage}
                        />
                    </React.Fragment>
                :
                <NuAddsProvider>
                    <Header></Header>
                    <Authorized
                        userId={userId}
                        userChosenName={userChosenName}
                        userEmail={userEmail}
                    />
                </NuAddsProvider>
    );
}