import * as React from 'react';
import {
    Snackbar,
    Alert
} from "@mui/material";
//import { Slide } from "@mui/material/index"
import { Fade } from "@mui/material/index"

function AlertComponent(props) {
    const { open, handleClose, severity, message } = props;
    //severity: success, info, warning, error
    function TransitionLeft(props) {
        //return <Slide {...props} direction="up" />;
        return <Fade {...props} />;
    }

    return (
        <React.Fragment>
            {" "}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                sx={{ width: '100%' }}
                TransitionComponent={TransitionLeft}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}>
                <Alert onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

export default AlertComponent;