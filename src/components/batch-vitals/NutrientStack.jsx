import * as React from 'react';
import { axiosPrivate } from '../../apis/axios';
import useAxiosFunction from '../../Hooks/useAxiosFunction';

import NutrientAddition from './NutrientAddition';
import NuAddDropdown from './NuAddDropdown';
import { NuAddsContext, NuAddsDispatchContext } from '../../Context/NuAddsContext'

import {
    Button,
    Card,
    CircularProgress,
    Grid,
    LinearProgress,
    Tooltip,
    Typography,
} from '@mui/material/';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import CalculateIcon from '@mui/icons-material/Calculate';
import DangerousIcon from '@mui/icons-material/Dangerous';



export default function NutrientStack({ batchId, nuAddsLoading, isLocked, dirtyVitalsBit, saveBatchData, handleSnackbarOpen }) {
    const nuAdds = React.useContext(NuAddsContext);
    const nuAddsDispatch = React.useContext(NuAddsDispatchContext);
    const [nutrients, setNutrients] = React.useState([]);
    const [stackPresets, setStackPresets] = React.useState([]);
    const [nutrientsData, nutrientsError, nutrientsLoading, axiosFetchNutrients] = useAxiosFunction();
    const [stackPresetsData, StackPresetsError, StackPresetsLoading, axiosFetchStackPresets] = useAxiosFunction();
    const [savedNuAddsData, nuAddsSaveError, nuAddsSaving, axiosFetchSaveNuAdds] = useAxiosFunction();

    const [dirtyBit, setDirtyBit] = React.useState(false);
    const [resetToggle, setResetToggle] = React.useState(false);

    //Dumb workaround required to submit NULL to an API from a controlled field.
    const transformFieldsForApi = (dataArray) => {
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

    //Configuration when NuAdds load
    React.useEffect(() => {
        if (nuAdds.length > 0 && nuAdds.filter((na) => na.gramsToAdd === null).length > 0) {
            setDirtyBit(true);
        }
    }, [nuAdds])

    //FROM DATABASE - Nutrients and Stack Presets
    React.useEffect(() => {
        getNutrientsData();
        getStackPresetData();
    }, [])
    const getNutrientsData = () => {
        axiosFetchNutrients({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/Nutrients/',
        });
    }
    React.useEffect(() => {
        setNutrients(nutrientsData);
    }, [nutrientsData])

    const getStackPresetData = () => {
        axiosFetchStackPresets({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/StackPresets/GetAll',
        });
    }
    React.useEffect(() => {
        setStackPresets(stackPresetsData);
    }, [stackPresetsData])

    React.useEffect(() => {
        if (dirtyVitalsBit === true) {
            setDirtyBit(dirtyVitalsBit);
        }
    }, [dirtyVitalsBit])

    //Handle +Nutrient
    const handleNutrientAdd = (nutrientId) => {
        newNuAdd(nutrientId);
        setDirtyBit(true);
    };
    const newNuAdd = (nutrientId) => {
        var priority = getLastPriority() + 1;
        axiosPrivate.post(`NutrientAdditions/Create`, null,
            {
                params: {
                    batchId,
                    nutrientId,
                    priority
                }
            },
        ).then((response) => {
            nuAddsDispatch({
                type: "created",
                data: response.data
            });
            console.log(nuAdds);
        }).catch((response) => {
            console.log(response);
        });
    }

    const handlePresetChoice = (stackPresetId) => {
        loadPresetNuAdds(stackPresetId);
    }
    const loadPresetNuAdds = (stackPresetId) => {

        axiosPrivate.post(`NutrientAdditions/StackPreset`, null,
            {
                params: {
                    batchId,
                    stackPresetId
                }
            },
        ).then((response) => {
            nuAddsDispatch({
                type: "loaded",
                data: response.data
            });
        }).catch((response) => {
            console.log(response);
        });
    }

    //Saving NuAdds
    React.useEffect(() => {
        if (!nuAddsSaveError && (savedNuAddsData.length > 0)) {
            nuAddsDispatch({
                type: "loaded",
                data: savedNuAddsData
            });
            setDirtyBit(false);
        }
    }, [savedNuAddsData])
    React.useEffect(() => {
        if (nuAddsSaveError != false) {
            handleSnackbarOpen("Error saving nutrient stack", "error");
        }
    }, [nuAddsSaveError])
    const saveNuAdds = () => {
        const ApiReadyNuAdds = transformFieldsForApi(nuAdds);
        axiosFetchSaveNuAdds({
            axiosInstance: axiosPrivate,
            method: 'POST',
            data: ApiReadyNuAdds,
            url: 'NutrientAdditions/UpdateAll'
        });
    }
    const onSaveHandler = () => {
        saveBatchData(saveNuAdds, nuAdds);
    }

    //Clearing NuAdds
    const clearNuAdds = () => {
        const apiReadyNuAdds = transformFieldsForApi(nuAdds);
        axiosPrivate.post(`NutrientAdditions/Reset`, apiReadyNuAdds
        ).then((response) => {
            nuAddsDispatch({
                type: "loaded",
                data: []
            });
            setDirtyBit(false);
        }).catch((response) => {
            console.log(response);
        });
    }
    const handleResetConfirmClick = () => {
        setResetToggle(!resetToggle);
        clearNuAdds();
    }
    const handleClickAway = () => {
        setResetToggle(false);
    }
    const handleResetClick = () => {
        setResetToggle(!resetToggle);
    }

    //Editing NuAddOverrides
    const onChangeHandler = (update) => {
        nuAddsDispatch({
            type: "updated",
            data: update
        });

        setDirtyBit(true);
    }

    //Refreshing NuAdd from DB source nutrient data
    const onRefreshHandler = (nuAdd) => {
        refreshNuAdd(nuAdd);
    }
    const refreshNuAdd = (nuAdd) => {
        const ApiReadyNuAdd = transformFieldsForApi([nuAdd])[0];
        axiosPrivate.post(`NutrientAdditions/RestoreDefaultValues`, ApiReadyNuAdd
        ).then((response) => {
            setDirtyBit(true);
            nuAddsDispatch({
                type: "updated",
                data: response.data
            });
        }).catch((response) => {
            console.log(response);
        });
    }

    //Removing NuAdd
    const onRemoveHandler = (nuAdd) => {
        removeNuAdd(nuAdd);
    }
    const removeNuAdd = (nuAdd) => {
        let ApiReadNuAdds = transformFieldsForApi([nuAdd]);
        axiosPrivate.post(`NutrientAdditions/Delete`, nuAdd
        ).then((response) => {
            setDirtyBit(true);
            nuAddsDispatch({
                type: "deleted",
                data: nuAdd
            });
        }).catch((response) => {
            console.log(response);
        });
    }

    const getLastPriority = () => {
        let maxValue = 0;
        const values = Object.values(nuAdds);

        values.map((el) => {
            const valueFromObject = el.priority;
            maxValue = Math.max(maxValue, valueFromObject);
        });
        return maxValue;
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} sx={{ mb: 0 }}>
                <Grid item xs={12} sm={6} align="center">
                    <Typography sx={{ mt: 0 }} variant="h6" align="left">Nutrients:</Typography>
                </Grid>
                <Grid item xs={6} sm={6} align="left">
                    <Tooltip title="Save Changes and Calculate" enterDelay={1000} enterNextDelay={1000} placement="top">
                        <span>
                            <Button
                                size="small"
                                color="success"
                                onClick={onSaveHandler}
                                disabled={!dirtyBit}
                                type="submit"
                                fullWidth
                                variant="contained"
                                startIcon={<CalculateIcon />}
                            >
                                Save
                            </Button>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ pt: .5, pb: .5 }}>
                {((dirtyBit || dirtyVitalsBit) && !isLocked && nuAdds.length > 0) &&
                    <Grid item xs={12} align="center">
                        <Typography variant='h7' color='orangered'>
                            You have unsaved changes. Calculated values may be incorrect.
                        </Typography>
                    </Grid>
                }
                <Grid item xs={12} sm={3} md={12} lg={3} align="center">
                    {nutrientsLoading &&
                        <LinearProgress />}

                    {!nutrientsLoading && nutrientsError &&
                        <Typography> {nutrientsError}</Typography>}

                    {!nutrientsLoading && !nutrientsError && nutrients.length &&
                        <NuAddDropdown
                            nutrients={nutrients}
                            handleSubmit={handleNutrientAdd}
                            disabled={nuAdds.length >= 5 || isLocked}
                        />
                    }
                    {!nutrientsLoading && !nutrientsError && !nutrients.length &&
                        <Typography>Loading</Typography>}
                    
                </Grid>
                <Grid item xs={12} sm={6} md={12} lg={6} align="left">

                    {StackPresetsLoading
                        ? <LinearProgress />
                        : <Grid container spacing={1}>
                            {stackPresets.length > 0
                                ?
                                stackPresets.map(
                                    (mappedStackPreset) => {
                                        return (
                                            <Grid item xs={6} sm={6} align="left" key={mappedStackPreset.id}>
                                                <Button
                                                    size="small"
                                                    fullWidth
                                                    color="info"
                                                    onClick={(e) => {
                                                        handlePresetChoice(mappedStackPreset.id);
                                                    }}
                                                    disabled={(nuAdds.length > 0)}
                                                    variant="outlined"
                                                >
                                                    {mappedStackPreset.name}
                                                </Button>
                                            </Grid>
                                        )
                                    }
                                )
                                :
                                <Typography>(No Presets Found)</Typography>
                            }

                        </Grid>
                    }

                </Grid>
                <Grid item xs={12} sm={3} md={12} lg={3} align="center">
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Tooltip title="Clear Nutrient Stack" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                            <span>
                                {!resetToggle
                                    ? <Button
                                        size="small"
                                        fullWidth
                                        color="warning"
                                        onClick={handleResetClick}
                                        disabled={isLocked}
                                        variant="outlined"
                                    >
                                        Clear
                                    </Button>
                                    : <Button
                                        size="small"
                                        fullWidth
                                        color="error"
                                        onClick={handleResetConfirmClick}
                                        disabled={isLocked}
                                        variant="outlined"
                                        startIcon={<DangerousIcon />}
                                    >
                                        Confirm?
                                    </Button>
                                }
                            </span>
                        </Tooltip>
                    </ClickAwayListener>
                </Grid>
            </Grid>

            {nuAdds.length === 0
                ? <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} align="center">
                        <Card sx={{
                            p: 1,
                            mb: 1,
                            borderRight: 2,
                            borderBottom: 2,
                            borderColor: 'darkslategrey'
                        }} >
                            {nuAddsLoading === true || nuAddsSaving === true
                                ? <Grid container align="center" justifyContent="center">
                                    <Grid item>
                                        <CircularProgress />
                                    </Grid>
                                </Grid>
                                : <Typography>Choose a preset above, or click <b>+ ADD</b> below.</Typography>
                            }
                        </Card>
                    </Grid>
                </Grid>
                :
                <React.Fragment>
                    {
                        nuAdds.map
                            (
                                (mappedNuAdd) => {
                                    return (

                                        <NutrientAddition
                                            key={mappedNuAdd.id}
                                            nuAdd={mappedNuAdd}
                                            disabled={isLocked}
                                            dirtyBit={dirtyBit}
                                            onChangeHandler={onChangeHandler}
                                            onRefreshHandler={onRefreshHandler}
                                            onRemoveHandler={onRemoveHandler}
                                        />
                                    )
                                }
                            )
                    }
                </React.Fragment>
            }
        </React.Fragment>
    );
}