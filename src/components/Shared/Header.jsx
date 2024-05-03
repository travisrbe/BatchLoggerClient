import * as React from 'react';

import { axiosPrivate } from '../../apis/axios';
import useAxiosFunction from '../../Hooks/useAxiosFunction';

import {
    AppBar,
    Button,
    Grid,
    Link,
    Toolbar,
    Typography
} from '@mui/material';

import useAuth from '../../hooks/useAuth';


function Header() {
    const { setAuth, auth } = useAuth();

    const [loggedout, error, loading, axiosLogout] = useAxiosFunction();

    const handleLogout = () => {
        axiosLogout({
            axiosInstance: axiosPrivate,
            method: 'POST',
            url: '/account/logout'
        });
        const loggedIn = false;
        setAuth({ loggedIn });
    }
    return (
        <AppBar position="fixed" color="success">
            <Toolbar className="header-toolbar" sx={{ borderBottom: 2, borderColor: 'darkslategrey' }}>
                <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
                    <Grid item xs={4}>
                       
                    </Grid>
                    <Grid item xs={4} justifyContent="center" alignItems="center">
                        {/*<Box*/}
                        {/*    component="img"*/}
                        {/*    sx={{*/}
                        {/*        height: 233,*/}
                        {/*        width: 350,*/}
                        {/*        maxHeight: { xs: 50, md: 50 },*/}
                        {/*        maxWidth: { xs: 200, md: 200},*/}
                        {/*    }}*/}
                        {/*    alt="test."*/}
                        {/*    src="https://i.imgur.com/JuEFfXM.jpg"*/}
                        {/*/>*/}
                        <Typography
                            component="h2"
                            variant="h5"
                            align="center"
                            noWrap
                            sx={{ flex: 1 }}
                        >
                            Batch Logger
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
                        {auth?.loggedIn &&
                            <React.Fragment>
                                <Typography>Hello, {auth.userName} | </Typography>
                                <Button onClick={handleLogout}>Logout</Button>
                            </React.Fragment>}
                        {!auth?.loggedIn &&
                            <Link href="/">Login</Link>
                            }
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default Header;