import * as React from 'react';
import { axiosPrivate } from '../../apis/axios';
import useAxiosFunction from '../../Hooks/useAxiosFunction';

import BatchesReducer from '../../reducers/BatchesReducer.js';

import BatchDrawer from '../batch-drawer/BatchDrawer';
import TabbedCenter from '../tabbed-center/TabbedCenter';
import BatchVitals from '../batch-vitals/BatchVitals';
import {
    CircularProgress,
    Grid,
    Toolbar,
} from '@mui/material';

import {NuAddsDispatchContext } from '../../Context/NuAddsContext';

export default function Authorized({ userId, userChosenName, userEmail }) {

    const [batchId, setBatchId] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    //User batches
    const [batches, batchesDispatch] = React.useReducer(BatchesReducer, []);
    const [batchesData, errorBatches, loadingBatches, axiosFetchBatches] = useAxiosFunction()

    //Remove Batch
    const [removedBatch, errorRemoveBatch, loadingRemoveBatch, axiosFetchRemoveBatch] = useAxiosFunction();

    //NuAdds
    const dispatch = React.useContext(NuAddsDispatchContext);
    const [nuAddsData, nuAddsError, nuAddsLoading, axiosFetchNuAdds] = useAxiosFunction();

    //Open Drawer
    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    }

    //BatchId change.
    const handleBatchIdChange = (id) => {
        setBatchId(id);
    };
    React.useEffect(() => {
        if (batchId != null) {
            getNuAdds(batchId);
        }
    }, [batchId])

    //NuAdds Loading
    React.useEffect(() => {
        if (!nuAddsLoading) {
            dispatch({
                type: "loaded",
                data: nuAddsData
            });
        }
    }, [nuAddsData])
    const getNuAdds = () => {
        axiosFetchNuAdds({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/NutrientAdditions/Batch/' + batchId,
        });
    }
    const handleBatchRefresh = () => {
        if (batchId != null) {
            getNuAdds(batchId);
        }
    }

    //Load Batches
    const getBatches = () => {
        axiosFetchBatches({
            axiosInstance: axiosPrivate,
            method: 'GET',
            url: '/Batches/MyBatches'
        });
    }
    React.useEffect(() => {
        getBatches();
    }, [])
    React.useEffect(() => {
        if (!loadingBatches) {
            batchesDispatch({
                type: "loaded",
                data: batchesData
            });
        }
    }, [batchesData])

    //Remove Batch
    const handleRemoveBatch = (batch) => {
        axiosFetchRemoveBatch({
            axiosInstance: axiosPrivate,
            method: 'POST',
            data: batch,
            url: '/Batches/Delete'
        })
    }
    React.useEffect(() => {
        if (!loadingRemoveBatch && removedBatch!= '') {
            batchesDispatch({
                type: "deleted",
                data: removedBatch
            });
            //handleOpen("Removed Log Entry.", "success");
        }
        if (errorRemoveBatch) {
            //handleOpen("Error removing Log Entry.", "error");
        }
    }, [loadingRemoveBatch])

    //dispatches
    const handleNewBatchDispatch = (batch) => {
        batchesDispatch({
            type: "created",
            data: batch
        })
    }

    const handleBatchNameChange = (update) => {
        batchesDispatch({
            type: "updated",
            data: update
        });
    }
    
    return (

        <React.StrictMode>
            <Toolbar />

            <Grid container spacing={.5} alignItems="top" justifyContent="center" sx={{ pb: 10 }}>

                <div>
                    <BatchDrawer
                        onBatchIdChange={handleBatchIdChange}
                        handleDrawerToggle={handleDrawerToggle}
                        drawerOpen={drawerOpen}
                        loadingBatches={loadingBatches}
                        batches={batches}
                        handleNewDispatch={handleNewBatchDispatch}
                        onRemoveHandler={handleRemoveBatch}
                    />
                </div>


                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{m:.5}}>
                    <BatchVitals
                        batchId={batchId}
                        nuAddsLoading={nuAddsLoading}
                        onBatchRefresh={handleBatchRefresh}
                        handleDrawerToggle={handleDrawerToggle}
                        handleBatchNameChange={handleBatchNameChange}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={7} lg={6} xl={6} sx={{m:.5}}> {/*sx={{ borderRight: '2px solid green', borderLeft: '2px solid green' }}>*/}
                    <TabbedCenter
                        batchId={batchId}
                        userChosenName={userChosenName} />
                </Grid>
            </Grid>
        </React.StrictMode>

    )
}