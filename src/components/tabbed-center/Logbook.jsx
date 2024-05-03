import * as React from 'react';
import { axiosPrivate } from '../../apis/axios';
import useAxiosFunction from '../../Hooks/useAxiosFunction';
import AlertComponenet from '../shared/AlertComponent';

import LogEntriesReducer from '../../reducers/LogEntriesReducer.js';
import LogEntry from './LogEntry'
import { NuAddsContext, NuAddsDispatchContext } from '../../Context/NuAddsContext'

import {
    Button,
    CircularProgress,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material/';

import NotesIcon from '@mui/icons-material/Notes';

function Logbook({ batchId, userChosenName }) {
    const nuAdds = React.useContext(NuAddsContext);

    const [batchLogEntries, dispatch] = React.useReducer(LogEntriesReducer, []);

    //LOAD all Log Entries
    const [batchLogEntriesData, errorBatchLogEntries, loadingBatchLogEntries, axiosFetchBatchLogEntries] = useAxiosFunction();
    //Update Log Entry
    const [logEntryUpdateData, errorLogEntryUpdate, loadingLogEntryUpdate, axiosLogEntryUpdate] = useAxiosFunction();
    //Delete Log Entry
    const [deletedLogEntry, errorLogEntryDelete, loadingLogEntryDelete, axiosLogEntryDelete] = useAxiosFunction();
    //Delete Log Entry
    const [createdLogEntry, errorLogEntryCreate, loadingLogEntryCreate, axiosLogEntryCreate] = useAxiosFunction();

    //Snackbar
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('');
    const handleOpen = (message, severity) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        setOpen(false);
    };

    const transformFieldsForApi = (object) => {
        if (object.specificGravityReading === '') {
            object.specificGravityReading = null;
        }
        if (object.pHReading == '') {
            object.pHReading = null;
        }
        return object;
    }

    const transformNuAddsForApi = (dataArray) => {
        dataArray.forEach((datum) => {
            if (datum.maxGramsPerLiterOverride === '') {
                datum.maxGramsPerLiterOverride = null;
            }
            if (datum.yanPpmPerGramOverride == '') {
                datum.yanPpmPerGramOverride = 0;
            }
        });
        return dataArray;
    }

    //LOAD from database.
    React.useEffect(() => {
        if (!loadingBatchLogEntries) {
            dispatch({
                type: "loaded",
                data: batchLogEntriesData
            });
        }
    }, [loadingBatchLogEntries])
    React.useEffect(() => {
        if (batchId != null && batchId != undefined) {
            axiosFetchBatchLogEntries({
                axiosInstance: axiosPrivate,
                method: 'GET',
                url: '/BatchLogEntries/Batch/' + batchId,
            });
        }
    }, [batchId])

    //SAVE
    const handleSave = (logEntry) => {
        const ApiReadyLogEntry = transformFieldsForApi(logEntry);
        axiosLogEntryUpdate({
            axiosInstance: axiosPrivate,
            method: 'POST',
            data: ApiReadyLogEntry,
            url: '/BatchLogEntries/Update/',
        });
    }
    React.useEffect(() => {
        if (!loadingLogEntryUpdate && logEntryUpdateData != '') {
            dispatchChange(logEntryUpdateData);
            handleOpen("Saved Log Entry.", "success");
        }
        if (errorLogEntryUpdate) {
            handleOpen("Error saving Log Entry.", "error");
        }
    }, [loadingLogEntryUpdate])

    //DELETE
    const handleDelete = (logEntry) => {
        let ApiReadyLogEntry = transformFieldsForApi(logEntry);
        axiosLogEntryDelete({
            axiosInstance: axiosPrivate,
            method: 'POST',
            data: ApiReadyLogEntry,
            url: '/BatchLogEntries/Delete/',
        })
    }
    React.useEffect(() => {
        if (!loadingLogEntryDelete && deletedLogEntry != '') {
            dispatchDelete(deletedLogEntry);
            handleOpen("Removed Log Entry.", "success");
        }
        if (errorLogEntryDelete) {
            handleOpen("Error removing Log Entry.", "error");
        }
    }, [loadingLogEntryDelete])

    //CREATE NEW
    const handleNew = () => {
        axiosLogEntryCreate({
            axiosInstance: axiosPrivate,
            method: 'POST',
            data: batchId,
            url: '/BatchLogEntries/Create/',
        })
    }
    React.useEffect(() => {
        if (!loadingLogEntryCreate && createdLogEntry != '') {
            dispatch({
                type: "created",
                data: createdLogEntry
            })
            handleOpen("New entry added - click edit to modify.", "success");
        }
        if (errorLogEntryCreate) {
            handleOpen("Error adding Log Entry.", "error");
        }
    }, [loadingLogEntryCreate])

    //IMPORT
    const handleImport = () => {
        transformNuAddsForApi(nuAdds);
        axiosLogEntryCreate({
            axiosInstance: axiosPrivate,
            method: 'POST',
            data: nuAdds,
            url: '/BatchLogEntries/Import/',
        })
    }

    //DISPATCHES
    const dispatchChange = (update) => {
        dispatch({
            type: "updated",
            data: update
        });
    };
    const dispatchDelete = (update) => {
        dispatch({
            type: "deleted",
            data: update
        })
    }

    //=======================================
    //=======================================
    //=======================================

    if (loadingBatchLogEntries) {
        return (
            <Grid container align="center" justifyContent="center">
                <Grid item>
                    <CircularProgress />
                </Grid>
            </Grid>
        )
    }
    else if (errorBatchLogEntries) {
        return (
            <React.Fragment>
                <Typography>Error loading log entries: {errorBatchLogEntries}</Typography>
            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment>
                <Grid spacing={2} container>
                    <Grid item xs={5} sm={4} md={4}>
                        <Tooltip title="Import Your Nutrient Stack" enterDelay={1000} enterNextDelay={1000} placement="top">
                            <span>
                                <Button
                                    size="small"
                                    fullWidth
                                    disabled={nuAdds.length < 1}
                                    onClick={handleImport}
                                    color="success"
                                    variant="outlined"
                                    startIcon={<NotesIcon />}
                                >
                                    Import
                                </Button>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                    </Grid>
                    <Grid item xs={5} sm={4} md={4}>
                        <Tooltip title="New Blank Log Entry" enterDelay={1000} enterNextDelay={1000} placement="top">
                            <span>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    color="success"
                                    onClick={handleNew}
                                >
                                    <b>New Entry</b>
                                </Button>

                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>

                {batchLogEntries?.length > 0 &&
                    batchLogEntries.map((mappedLog) => (
                            <LogEntry
                                key={mappedLog.id}
                                logEntry={mappedLog}
                                userChosenName={userChosenName}
                                onChangeHandler={dispatchChange}
                                onSaveHandler={handleSave}
                                onRemoveHandler={handleDelete}
                            >
                            </LogEntry>
                        )
                    )
                }
                <AlertComponenet
                    open={open}
                    handleClose={handleClose}
                    severity={severity}
                    message={message}
                />
            </React.Fragment>
        );
    }
}

export default Logbook;