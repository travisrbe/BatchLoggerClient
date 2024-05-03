import * as React from 'react';
import { axiosPrivate } from '../../apis/axios';
import useAxiosFunction from '../../Hooks/useAxiosFunction';

import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    Switch
} from '@mui/material/';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import AlertComponenet from '../shared/AlertComponent';
import YeastsDropdown from './YeastsDropdown';
import NutrientStack from './NutrientStack';

export default function BatchVitals({ batchId, nuAddsLoading, onBatchRefresh, handleDrawerToggle, handleBatchNameChange}) {
    const [nutriMultiDisplay, setNutriMultiDisplay] = React.useState('');
    const [dirtyBit, setDirtyBit] = React.useState(false);

    const [batch, setBatch] = React.useState(null);
    const [batchData, error, loading, axiosFetch] = useAxiosFunction();

    const [yeasts, setYeasts] = React.useState([]);
    const [yeastsData, yeastsError, yeastsLoading, axiosFetchYeasts] = useAxiosFunction();

    const [reloadToggle, setReloadToggle] = React.useState(false);

    const BASE_URL = 'https://localhost:5173/';
    //const BASE_URL = 'https://api-cellarnotes-eastus-dev01.azurewebsites.net/api/';

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

    const getBatchData = (id) => {
        axiosFetch({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/Batches/Batch/' + id,
        });
    }

    //RELOAD
    const reload = () => {
        if (batchId != null) {
            getBatchData(batchId);
            setDirtyBit(false);
        }
    }
    const handleReloadConfirmClick = () => {
        setReloadToggle(false);
        reload();
    }

    //Initial Load
    React.useEffect(() => {
        if (batchId != null) {
            getBatchData(batchId);
        }
    }, [batchId])

    React.useEffect(() => {
        setBatch(batchData);
        if (batchData?.id != null) {
            onBatchRefresh(batchData.id);
        }
    }, [batchData])

    //Batch Saving
    const transformFieldsForApi = (object) => {
        if (object.phReading === '') {
            object.phReading = null;
        }
        return object;
    }

    const saveBatchData = (cb, nuAdds) => {
        transformFieldsForApi(batch)
        axiosPrivate.post('/Batches/Update/', batch,
        ).then((response) => {
            if (response.status === 200 && response.data?.id != null) {
                setBatch(response.data);
                handleOpen("Saved " + response.data.name, "success");
                handleBatchNameChange(batch);
                setDirtyBit(false);
                if (nuAdds != null) {
                    cb(nuAdds);
                }
            }
            else if (response.status === 200 && response.data?.id === null) {
                handleOpen("Saved " + response.data.name, "success");
            }
            else {
                handleOpen("Error saving " + batch.name, "error")
                //udpate batch state to re-render?
            }
        }).catch((response) => {
            handleOpen("Error saving " + batch.name + "... " + response.response.status + " error.", "error")
            console.log(response);
        }).finally(() => {
            //
        });
    }

    //Yeasts Loading
    const getYeastsData = () => {
        axiosFetchYeasts({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/Yeasts/',
        });
    }
    React.useEffect(() => {
        getYeastsData();
    }, [])

    React.useEffect(() => {
        setYeasts(yeastsData);
    }, [yeastsData])

    React.useEffect(() => {
        if (batch?.id && yeasts?.length > 0) {
            setNutriMultiDisplay(yeasts.find((y) => y.id == batch.yeastId).multiplierName);
        }
    }, [batch, yeasts])
    const handleYeastChange = (yeastId) => {
        if (yeastId) {
            setNutriMultiDisplay(yeasts.find((y) => y.id == yeastId).multiplierName)
            setBatch(
                batch => ({
                    ...batch,
                    yeastId: yeastId
                })
            )
            setDirtyBit(true);
        }
    };

    //MAKE PUBLIC
    const handlePublicToggle = () => {
        axiosPrivate.post('/Batches/TogglePublic/' + batchId
        ).then((response) => {
            if (response.status === 200) {
                setBatch(
                    batch => ({
                        ...batch,
                        isPublic: !batch.isPublic
                    })
                )
            }
        }).catch((response) => {
            handleOpen("Error enabling public sharing for " + batch.name + "... " + response.response.status + " error.", "error")
            console.log(response);
        });
    }

    //Handle changes to batch - move to Reducer?
    const handleNameChange = (name) => {
        setBatch(
            batch => ({
                ...batch,
                name: name
            })
        )
        setDirtyBit(true);
    }
    const handleIsLockedChange = () => {
        setBatch(
            batch => ({
                ...batch,
                isLocked: !batch.isLocked
            })
        )
        setDirtyBit(true);
    }

    const handleVolumeChange = (vol) => {
        setBatch(
            batch => ({
                ...batch,
                volumeLiters: vol
            })
        )
        setDirtyBit(true);
    };

    const handleSgChange = (sg) => {
        setBatch(
            batch => ({
                ...batch,
                specificGravity: sg
            })
        )
        setDirtyBit(true);
    };

    const handleOffsetChange = (offset) => {
        setBatch(
            batch => ({
                ...batch,
                offsetYanPpm: offset
            })
        )
        setDirtyBit(true);
    };

    const handleGoFermChange = () => {
        setBatch(
            batch => ({
                ...batch,
                goFermUsed: !batch.goFermUsed
            })
        )
        setDirtyBit(true);
    }

    const handleIngredientsChange = (ingredients) => {
        setBatch(
            batch => ({
                ...batch,
                ingredients: ingredients
            })
        )
        setDirtyBit(true);
    }

    const handleProcessChange = (process) => {
        setBatch(
            batch => ({
                ...batch,
                process: process
            })
        )
        setDirtyBit(true);
    }

    const handlePHChange = (phReading) => {
        setBatch(
            batch => ({
                ...batch,
                phReading: phReading
            })
        )
        setDirtyBit(true);
    }

    const handleToggleCompleteBatch = () => {
        setBatch(
            batch => ({
                ...batch,
                isComplete: !batch.isComplete
            })
        )
        setDirtyBit(true);
    }
    
    //could componetize each section

    if (loading) {
        return (
            <React.Fragment>
                <Grid container align="center" justifyContent="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    else if (!loading && error) {
        return (
            <React.Fragment>
                <Box
                    sx={{
                        width: '100%',
                    }}>
                    <Typography>{error}</Typography>
                </Box>
            </React.Fragment>
        )
    }

    else if (!loading && !error && !batch?.id) {
        return (
            <React.Fragment>
                <Tooltip title="Show Batch Drawer" enterDelay={1000} enterNextDelay={1000} placement="top">
                    <IconButton
                        color="info"
                        onClick={() => { handleDrawerToggle(true) }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Tooltip>
                <Grid container align="center" justifyContent="center">
                    <Grid item>
                        <Typography>No Batch to Display</Typography>
                        <Typography>Click the arrow on the left.</Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    else if (!loading && !error && batch?.id) {
        return (
            <Box sx={{m:1}}>
                <Grid spacing={2} pb={2} pt={1} container alignItems="center"> {/*TOP LEVEL GRID*/}
                    <Grid item xs={1} sm={1} md={1} xl={1}>
                        <Tooltip title="Show Batch Drawer" enterDelay={1000} enterNextDelay={1000} placement="top">
                            <IconButton
                                color="info"
                                onClick={() => { handleDrawerToggle(true) }}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} xl={5}>
                        <TextField
                            required
                            autoComplete="off"
                            spellCheck="false"
                            disabled={batch.isLocked}
                            fullWidth
                            value={batch.name}
                            onChange={(e) => {
                                handleNameChange(e.target.value);
                            }}
                            size="small"
                            name="name"
                            id="batch-name"
                            label="Name"
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} xl={2} container alignItems="center" justifyContent="center">
                        <Switch
                            checked={batch.isLocked}
                            sx={{
                                "&.MuiSwitch-root .MuiSwitch-switchBase": {
                                    color: "#29b6f6"
                                },

                                "&.MuiSwitch-root .Mui-checked": {
                                    color: "#29b6f6"
                                }
                            }}
                            onChange={handleIsLockedChange}
                        />
                        <LockIcon fontSize="small" color="info" />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} xl={2} align="center">
                        <Tooltip title={batch.isComplete ? "Mark Batch Active" : "Mark Batch Complete"} enterDelay={1000} enterNextDelay={1000} placement="top">
                            <span>
                                <Button
                                    fullWidth
                                    color="info"
                                    onClick={handleToggleCompleteBatch}
                                    disabled={batch.isLocked}
                                    variant="outlined"
                                >
                                    {batch.isComplete ? "Complete" : "Active"}
                                </Button>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} xl={2} align="center">
                        <ClickAwayListener onClickAway={() => { setReloadToggle(false) }}>
                            <Tooltip title="Discard Changes" enterDelay={1000} enterNextDelay={1000} placement="top">
                                <span>
                                    {reloadToggle
                                        ? <Button
                                            fullWidth
                                            onClick={handleReloadConfirmClick}
                                            disabled={loading}
                                            variant="outlined"
                                            color="error"
                                        >
                                            Confirm
                                        </Button>
                                        : <Button
                                            fullWidth
                                            onClick={() => { setReloadToggle(true) }}
                                            disabled={loading || batch.isLocked}
                                            variant="outlined"
                                            color="warning"
                                        >
                                            Reload
                                        </Button>

                                    }
                                </span>
                            </Tooltip>
                        </ClickAwayListener>
                    </Grid>
                </Grid>

                <Grid container spacing={2} pb={2}> {/*TO LEVEL GRID*/}
                    <Grid item xs={12} sm={12}>
                        <Tooltip title={batch.isPublic ? "Private batches cannot be shared." : "Public batches can be shared."} enterDelay={1000} enterNextDelay={1000} placement="top">
                            <span>
                                {!batch.isPublic
                                    && <Button
                                        fullWidth
                                        color="info"
                                        onClick={handlePublicToggle}
                                        disabled={batch.isLocked}
                                        variant="standard"
                                    >
                                        MAKE PUBLIC AND GET SHAREABLE LINK
                                    </Button>
                                }
                                {batch.isPublic
                                    && <React.Fragment>
                                        <Button
                                            fullWidth
                                            color="info"
                                            onClick={handlePublicToggle}
                                            disabled={batch.isLocked}
                                            variant="standard"
                                        >
                                            MAKE PRIVATE
                                        </Button>
                                        <TextField
                                            disabled={true}
                                            fullWidth
                                            value={BASE_URL + "share/" + batch.id}
                                            size="small"
                                            name="ShareLink"
                                            id="share-link"
                                            label="Share Link"
                                        />
                                    </React.Fragment>
                                }

                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Grid container spacing={2} pb={2}> {/*TO LEVEL GRID*/}
                    <Grid item xs={4} sm={4}>
                        <TextField
                            required
                            autoComplete="off"
                            type="number"
                            disabled={batch.isLocked}
                            fullWidth
                            value={batch.specificGravity}
                            onChange={(e) => {
                                handleSgChange(e.target.value);
                            }}
                            size="small"
                            name="startingSpecificGravity"
                            id="startingSpecificGravity"
                            label="Starting Specific Gravity"
                        />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <TextField
                            autoComplete="off"
                            type="number"
                            disabled={batch.isLocked}
                            fullWidth
                            value={batch.phReading == null ? '' : batch.phReading }
                            onChange={(e) => {
                                handlePHChange(e.target.value);
                            }}
                            size="small"
                            name="Batch pH"
                            id="batch-ph"
                            label="pH"
                        />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <TextField
                            required
                            type="number"
                            autoComplete="off"
                            disabled={batch.isLocked}
                            fullWidth
                            value={batch.volumeLiters}
                            onChange={(e) => {
                                handleVolumeChange(e.target.value);
                            }}
                            size="small"
                            name="volume"
                            id="volume-liters"
                            label="Liters"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} pb={2}> {/*TOP LEVEL GRID*/}
                    <Grid item xs={6} sm={6}>
                        <TextField
                            required
                            autoComplete="off"
                            disabled={batch.isLocked}
                            fullWidth
                            value={batch.offsetYanPpm}
                            onChange={(e) => {
                                handleOffsetChange(e.target.value);
                            }}
                            size="small"
                            name="offsetPpm"
                            id="offsetPpm"
                            label="YAN Offset"
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        {yeastsLoading &&
                            <Grid container align="center" justifyContent="center">
                                <Grid item>
                                    <CircularProgress />
                                </Grid>
                            </Grid>
                        }

                        {!yeastsLoading && yeastsError &&
                            <Typography> {yeastsError}</Typography>}

                        {!yeastsLoading && !yeastsError && yeasts.length &&
                            <YeastsDropdown
                                yeasts={yeasts}
                                handleYeastChange={handleYeastChange}
                                selectedYeastId={batch.yeastId}
                                disabled={batch.isLocked} />}
                        {!yeastsLoading && !yeastsError && !yeasts.length &&
                            <Typography>No Yeasts</Typography>}
                    </Grid>
                </Grid>

                <Grid container spacing={2} pb={1}> {/*TOP LEVEL GRID*/}
                    <Grid item xs={3} sm={3} align="right"  >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    //value={true}
                                    color="info"
                                    checked={batch.goFermUsed}
                                    onChange={handleGoFermChange}
                                    disabled={batch.isLocked}
                                />}
                            label="Go-Ferm" />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField
                            fullWidth
                            disabled
                            error={dirtyBit}
                            value={batch.totalTargetYanPpm ?? "Target YAN"}
                            size="small"
                            name="TotalTargetYan"
                            id="total-target-yan"
                            label="Target YAN"
                        />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField
                            fullWidth
                            disabled
                            value={batch.brix ?? "Brix"}
                            size="small"
                            name="Brix"
                            id="brix"
                            label="Brix"
                        />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField
                            fullWidth
                            disabled
                            value={nutriMultiDisplay}
                            size="small"
                            name="readingNutrientRequirement"
                            id="readable-nutrient-requirement"
                            label="Nutri. Req."
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                            fullWidth
                            size="small"
                            autoComplete='off'
                            disabled={batch.isLocked}
                            spellCheck="false"
                            label="Ingredients"
                            multiline
                            minRows={2}
                            value={batch.ingredients}
                            onChange={(e) => {
                                handleIngredientsChange(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                            fullWidth
                            size="small"
                            autoComplete='off'
                            disabled={batch.isLocked}
                            spellCheck="false"
                            label="Process Notes"
                            multiline
                            minRows={2}
                            value={batch.process}
                            onChange={(e) => {
                                handleProcessChange(e.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <NutrientStack
                    batchId={batchId}
                    nuAddsLoading={nuAddsLoading}
                    isLocked={batch.isLocked}
                    dirtyVitalsBit={dirtyBit}
                    saveBatchData={saveBatchData}
                    handleSnackbarOpen={handleOpen}
                >
                </NutrientStack>
                <AlertComponenet
                    open={open}
                    handleClose={handleClose}
                    severity={severity}
                    message={message}
                />
            </Box>
        )
    }
}