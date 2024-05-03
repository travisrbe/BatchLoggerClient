import * as React from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import Header from './shared/Header';
import { axiosPrivate } from '../apis/axios';
import useAxiosFunction from '../Hooks/useAxiosFunction';

import {
    Grid,
    CircularProgress,
    Paper,
    Toolbar,
    TextField,
    Typography
}
    from '@mui/material/index';

export default function Share() {
    let { id } = useParams()
    const [batch, setBatch] = React.useState(null);
    const [batchData, errorBatchVitals, loadingBatchVitals, axiosFetchBatchVitals] = useAxiosFunction();

    const [nutrientAdditions, setNutrientAdditions] = React.useState(null);
    const [nuAddsData, errorNuAdds, loadingNuAdds, axiosFetchNuAdds] = useAxiosFunction();

    const [logEntries, setLogEntries] = React.useState(null);
    const [batchLogEntriesData, errorBatchLogEntries, loadingBatchLogEntries, axiosFetchBatchLogEntries] = useAxiosFunction();

    const [yeast, setYeast] = React.useState(null);
    const [yeastData, errorYeast, loadingYeast, axiosFetchYeast] = useAxiosFunction();

    const [userChosenName, setUserChosenName] = React.useState(null);
    const [userChosenNameData, errorUserChosenName, loadingUserChosenName, axiosFetchUserChosenName] = useAxiosFunction();

    //BATCH VITALS
    const getBatchData = (id) => {
        axiosFetchBatchVitals({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/Batches/Share/' + id,
        });
    }
    React.useEffect(() => {
        setBatch(batchData);
    }, [batchData])
    React.useEffect(() => {
        if (id != null) {
            getBatchData(id);
        }
    }, [])

    //NUTRIENT STACK
    const getNuAdds = () => {
        axiosFetchNuAdds({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/NutrientAdditions/Batch/' + id,
        });
    }
    React.useEffect(() => {
        if (nuAddsData?.length > 0) {
            setNutrientAdditions(nuAddsData);
        }
    }, [nuAddsData])
    React.useEffect(() => {
        if (id != null) {
            getNuAdds(id);
        }
    }, [])

    //LOG ENTRIES
    const getLogEntries = () => {
        axiosFetchBatchLogEntries({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/BatchLogEntries/Batch/' + id,
        });
    }
    React.useEffect(() => {
        if (batchLogEntriesData?.length > 0) {
            setLogEntries(batchLogEntriesData.reverse());
        }
    }, [loadingBatchLogEntries])
    React.useEffect(() => {
        if (id != null) {
            getLogEntries();
        }
    }, [])

    //YEAST
    const getYeast = (yeastId) => {
        axiosFetchYeast({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/Yeasts/' + yeastId,
        });
    }
    React.useEffect(() => {
        if (yeastData != null) {
            setYeast(yeastData);
        }
    }, [loadingYeast])
    React.useEffect(() => {
        if (batch?.yeastId != null) {
            getYeast(batch?.yeastId)
        }
    }, [batch?.yeastId])

    //USER
    const getUserChosenName = (ownerUserId) => {
        axiosFetchUserChosenName({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: 'Users/ChosenName/' + ownerUserId,
        });
    }
    React.useEffect(() => {
        if (userChosenNameData != null && userChosenNameData != '') {
            setUserChosenName(userChosenNameData);
        }
    }, [loadingUserChosenName])
    React.useEffect(() => {
        if (batch?.ownerUserId != null) {
            getUserChosenName(batch?.ownerUserId)
        }
    }, [batch?.ownerUserId])

    return (
        <React.StrictMode>
            <Header></Header>
            {!batch?.id && loadingBatchVitals
                && <React.Fragment>
                    <Toolbar />
                    <Grid container align="center" justifyContent="center">
                        <Grid item>
                            <CircularProgress />
                        </Grid>
                    </Grid>
                </React.Fragment>
            }

            {!batch?.id && !loadingBatchVitals
                && <React.Fragment>
                    <Toolbar />
                    <Toolbar />
                    <Grid container align="center" justifyContent="center">
                        <Grid item>
                            <Typography>404 - not found.</Typography>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }

            {batch?.id
                && <React.Fragment>
                    <Toolbar />
                    <Grid container spacing={1} alignItems="top" justifyContent="center" >
                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                            <Grid container spacing={1} align="center" alignItems="bottom" justifyContent="center" sx={{ mt: 2 }}>
                                <Grid item xs={12}> <Typography variant="h3">{batch.name}</Typography></Grid>
                                <Grid item xs={12}> Logbook from {userChosenName}</Grid>

                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="top" justifyContent="center" sx={{ mt: 0 }}>
                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>

                            <Grid container spacing={1} align="center" alignItems="top" justifyContent="center" >

                                <Grid item xs={5} sx={{ border: '2px solid transparent' }}> {/*VITALS GRID ITEM*/}
                                    <Typography variant="h4">Vitals</Typography>
                                    <Paper elevation={12} sx={{ p: 1, mb: 2 }}>
                                        <Grid container spacing={1} alignItems="top" justifyContent="center" >
                                            <Grid item xs={3}>
                                                <TextField
                                                    disabled={true}
                                                    fullWidth
                                                    value={batch.specificGravity}
                                                    variant="standard"
                                                    size="small"
                                                    name="startingSpecificGravity"
                                                    id="startingSpecificGravity"
                                                    label="Starting Specific Gravity"
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    disabled={true}
                                                    fullWidth
                                                    value={batch.phReading == null ? '' : batch.phReading}
                                                    variant="standard"
                                                    size="small"
                                                    name="Batch pH"
                                                    id="batch-ph"
                                                    label="pH"
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    disabled={true}
                                                    value={batch.brix ?? "Brix"}
                                                    variant="standard"
                                                    size="small"
                                                    name="Brix"
                                                    id="brix"
                                                    label="Brix"
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    disabled={true}
                                                    fullWidth
                                                    value={batch.volumeLiters}
                                                    variant="standard"
                                                    size="small"
                                                    name="volume"
                                                    id="volume-liters"
                                                    label="Liters"
                                                />
                                            </Grid>

                                            {/*///////////////////////////*/}

                                            <Grid item xs={3}>
                                                <TextField
                                                    disabled={true}
                                                    fullWidth
                                                    value={yeast.name ?? ""}
                                                    variant="standard"
                                                    size="small"
                                                    name="yeastName"
                                                    id="yeastName"
                                                    label="Yeast"
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    disabled={true}
                                                    fullWidth
                                                    value={batch.offsetYanPpm}
                                                    variant="standard"
                                                    size="small"
                                                    name="offsetPpm"
                                                    id="offsetPpm"
                                                    label="YAN Offset"
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    disabled
                                                    value={yeast.multiplierName ?? ""}
                                                    size="small"
                                                    variant="standard"
                                                    name="readingNutrientRequirement"
                                                    id="readable-nutrient-requirement"
                                                    label="Nutri. Req."
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    disabled
                                                    value={batch.totalTargetYanPpm ?? "Target YAN"}
                                                    variant="standard"
                                                    size="small"
                                                    name="TotalTargetYan"
                                                    id="total-target-yan"
                                                    label="Target YAN"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    <Paper elevation={12} sx={{ p: 1, mb: 2 }}>
                                        <Grid container spacing={1} alignItems="top" justifyContent="center" >

                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    autoComplete='off'
                                                    disabled={true}
                                                    spellCheck="false"
                                                    label="Ingredients"
                                                    variant="standard"
                                                    multiline
                                                    minRows={2}
                                                    value={batch.ingredients}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    autoComplete='off'
                                                    disabled={true}
                                                    spellCheck="false"
                                                    label="Process Notes"
                                                    variant="standard"
                                                    multiline
                                                    minRows={2}
                                                    value={batch.process}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    {/*NUTRIENT ADDITIONS*/}
                                    <Typography variant="h5">Nutrient Stack</Typography>
                                    {nutrientAdditions?.length > 0 &&
                                        nutrientAdditions.map((nuAdd, index) => (
                                            <Paper elevation={index % 2 == 0 ? 4 : 12} sx={{ p: 1, mb: .5 }} key={nuAdd.id}>
                                                <Grid container spacing={1} alignItems="top" justifyContent="center" >
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            disabled={true}
                                                            value={nuAdd.priority}
                                                            variant="standard"
                                                            name="NutrientName"
                                                            id="nutrient-name"
                                                            label="Priority"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            disabled={true}
                                                            value={nuAdd.nameOverride}
                                                            variant="standard"
                                                            name="NutrientName"
                                                            id="nutrient-name"
                                                            label="Nutrient"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            disabled={true}
                                                            value={(nuAdd.gramsToAdd == null) ? "0" : nuAdd.gramsToAdd}
                                                            variant="standard"
                                                            name="GramsToAdd"
                                                            id="grams-to-add"
                                                            label="Grams Added"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            disabled={true}
                                                            value={(nuAdd.yanPpmAdded == null) ? "n/a" : nuAdd.yanPpmAdded}
                                                            variant="standard"
                                                            name="YanPpmAdded"
                                                            id="yan-ppm-added"
                                                            label="Yan PPM"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        ))
                                    }
                                </Grid>

                                {/*LOG ENTRIES*/}
                                <Grid item xs={7}>
                                    <Typography variant="h4">Log Entries</Typography>
                                    {logEntries?.length > 0
                                        && logEntries.map((log, index) => (
                                            <Paper elevation={index % 2 == 0 ? 4 : 12} sx={{ p: 1, mb: 1 }} key={log.id} >
                                                <Grid container spacing={1} alignItems="top" justifyContent="center" >
                                                    <Grid item xs={2}>
                                                        {moment.utc(log.createDate, moment.ISO_8601).local().format("L")}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            size="small"
                                                            disabled={true}
                                                            fullWidth
                                                            autoComplete='off'
                                                            spellCheck="false"
                                                            label="Log Entry"
                                                            multiline
                                                            value={log.logText ?? ""}
                                                            variant="standard"
                                                            minRows={1}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <TextField
                                                            size="small"
                                                            disabled={true}
                                                            fullWidth
                                                            autoComplete='off'
                                                            spellCheck="false"
                                                            value={log.specificGravityReading == null ? '-' : log.specificGravityReading}
                                                            variant="standard"
                                                            label="Sp. Gr."
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <TextField
                                                            size="small"
                                                            disabled={true}
                                                            fullWidth
                                                            autoComplete='off'
                                                            spellCheck="false"
                                                            variant="standard"
                                                            value={log.pHReading == null ? '-' : log.pHReading}
                                                            label="pH"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }
        </React.StrictMode>
    );
}