import * as React from 'react';
import { axiosPrivate } from '../../apis/axios';
import useAxiosFunction from '../../Hooks/useAxiosFunction';
import moment from 'moment';

import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material/';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import DangerousIcon from '@mui/icons-material/Dangerous';

function LogEntry({ logEntry, onChangeHandler, onSaveHandler, onRemoveHandler }) {

    const [removeConfirmToggle, setRemoveConfirmToggle] = React.useState(false);
    const [isSaveEnabled, setIsSaveEnabled] =
        React.useState(logEntry.logText == '' && logEntry.specificGravityReading == '' && logEntry.pHReading == '');
    const [logEntrySnapshot, setLogEntrySnapshot] = React.useState(null);
    const [isMinified, setIsMinified] = React.useState(logEntry.isDataEntry);

    //EDIT, CANCEL, and SAVE button logic
    const handleToggleIsSaveEnabled = () => {
        //take snapshot of log entry for restore before enabling editing, clear it otherwise
        if (isSaveEnabled != true) {
            setLogEntrySnapshot(logEntry);
            setIsMinified(false);
        }
        else {
            setLogEntrySnapshot(null);
            setIsMinified(logEntry.isDataEntry);
        }
        setIsSaveEnabled(!isSaveEnabled);
    }
    const handleCancelClick = () => {
        onChangeHandler({
            ...logEntrySnapshot
        });
        handleToggleIsSaveEnabled();
    }
    const handleSaveClick = () => {
        onSaveHandler(logEntry);
        handleToggleIsSaveEnabled();
    }

    //DELETE button logic
    const handleRemoveClick = () => {
        setRemoveConfirmToggle(!removeConfirmToggle);
    }
    const handleRemoveConfirmClick = () => {
        onRemoveHandler(logEntry);
    }
    const handleClickAway = () => {
        setRemoveConfirmToggle(false);
    }


    return (
        <Paper elevation={10}
            sx={{
                p: 1,
                mt: 2,
                border: '2px solid darkslategrey'
            }} >
            <Grid container spacing={1} alignItems="top" > {/*TOP LEVEL GRID*/}
                <Grid item xs={12} sm={12} md={12} lg={2} align="center" >

                    <Grid container spacing={0} alignItems="center" >
                        <Grid item xs={6} sm={6} md={6} lg={12} align="center" >
                            {isMinified
                                ? <Button
                                    fullWidth
                                    size="small"
                                    variant="contained"
                                    color="info"
                                    onClick={() => { setIsMinified(!isMinified) }}
                                >

                                    Expand
                                </Button>
                                : <Button
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    onClick={() => { setIsMinified(!isMinified) }}
                                >
                                    Minify
                                </Button>
                            }
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12} align="center" >
                            {isSaveEnabled &&
                                <Tooltip title="Default to Minified" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                                    <span>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value={true}
                                                    color="info"
                                                    checked={logEntry.isDataEntry}
                                                    onClick={() => {
                                                        onChangeHandler({
                                                            ...logEntry,
                                                            isDataEntry: !logEntry.isDataEntry
                                                        })
                                                    }}
                                                    disabled={!isSaveEnabled}
                                                />}
                                            label="Data" />
                                    </span>
                                </Tooltip>
                            }
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={10} xl={7} align="center" > {/*TOP LEVEL GRID*/}
                    <Grid container spacing={2} pb={1} alignItems="center">
                        <Grid item xs={6} sm={3}>
                            <Typography>{moment.utc(logEntry.createDate, moment.ISO_8601).local().format("L")}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography>{moment.utc(logEntry.createDate, moment.ISO_8601).local().format("LT")}</Typography>
                        </Grid>

                        <Grid item xs={6} sm={3} align="left" >
                            <TextField
                                size="small"
                                type="number"
                                disabled={!isSaveEnabled}
                                fullWidth
                                autoComplete='off'
                                spellCheck="false"
                                //DO NOT CHANGE THESE WITHOUT LOOKING AT THE REDUCER AND NUTRIENT STACK
                                //REACT DOES NOT HANDLE NULL NUMERIC VERY WELL
                                value={logEntry.specificGravityReading == null ? '' : logEntry.specificGravityReading}
                                onChange={(e) => {
                                    onChangeHandler({
                                        ...logEntry,
                                        specificGravityReading: e.target.value
                                    });
                                }}
                                label="Sp. Gr."
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} align="left" >
                            <TextField
                                size="small"
                                type="number"
                                disabled={!isSaveEnabled}
                                fullWidth
                                autoComplete='off'
                                spellCheck="false"
                                //DO NOT CHANGE THESE WITHOUT LOOKING AT THE REDUCER AND NUTRIENT STACK
                                //REACT DOES NOT HANDLE NULL NUMERIC VERY WELL
                                value={logEntry.pHReading == null ? '' : logEntry.pHReading}
                                onChange={(e) => {
                                    onChangeHandler({
                                        ...logEntry,
                                        pHReading: e.target.value
                                    });
                                }}
                                label="pH"
                            />
                        </Grid>
                        {!isMinified &&
                            <Grid item xs={12} sm={12} >
                                <TextField
                                    size="small"
                                    disabled={!isSaveEnabled}
                                    fullWidth
                                    autoComplete='off'
                                    spellCheck="false"
                                    label="Log Entry"
                                    multiline
                                    value={logEntry.logText ?? ""}
                                    onChange={(e) => {
                                        onChangeHandler({
                                            ...logEntry,
                                            logText: e.target.value
                                        });
                                    }}
                                    minRows={1}
                                    sx={{ p: 0, m: 0 }}
                                />
                            </Grid>
                        }
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} xl={3} align="top"> {/*TOP LEVEL GRID*/}

                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} xl={12} align="top">
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <Tooltip title="Permanently Delete" enterDelay={1000} enterNextDelay={1000} placement="top">
                                    <span>
                                        {!removeConfirmToggle
                                            ? <Button
                                                size="small"
                                                fullWidth
                                                color="warning"
                                                variant="outlined"
                                                onClick={handleRemoveClick}
                                            >
                                                Remove
                                            </Button>
                                            :
                                            <Button
                                                size="small"
                                                fullWidth
                                                color="error"
                                                variant="outlined"
                                                onClick={handleRemoveConfirmClick}
                                                startIcon={<DangerousIcon />}
                                            >
                                                Confirm
                                            </Button>
                                        }
                                    </span>
                                </Tooltip>
                            </ClickAwayListener>
                        </Grid>
                        <Grid item xs={12} sm={6} xl={12} align="top">
                            {isSaveEnabled
                                ? <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Tooltip title="Revert" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                                            <span>
                                                <Button
                                                    size="small"
                                                    fullWidth
                                                    onClick={handleCancelClick}
                                                    color="info"
                                                    variant="outlined"
                                                >
                                                    Cancel
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Tooltip title="Save Log Entry" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                                            <span>
                                                <Button
                                                    size="small"
                                                    fullWidth
                                                    onClick={handleSaveClick}
                                                    color="success"
                                                    variant="contained"

                                                >
                                                    Save
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                : <Tooltip title="Edit Log Entry" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                                    <span>
                                        <Button
                                            size="small"
                                            fullWidth
                                            color="info"
                                            onClick={handleToggleIsSaveEnabled}
                                            variant="outlined"

                                        >
                                            Edit
                                        </Button>
                                    </span>
                                </Tooltip>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default LogEntry;