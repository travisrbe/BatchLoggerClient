import * as React from 'react';
import BatchCard from './BatchCard';
import { axiosPrivate } from '../../apis/axios';
import useAxiosFunction from '../../Hooks/useAxiosFunction';

import BatchesReducer from '../../reducers/BatchesReducer.js';

import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Drawer,
    Grid,
    List,
    Tab,
} from '@mui/material';

import {
    TabList,
    TabContext,
    TabPanel
} from '@mui/lab/';

export default function BatchDrawer({ onBatchIdChange, drawerOpen, handleDrawerToggle, loadingBatches, batches, handleNewDispatch, onRemoveHandler }) {
    const [selectedBatchId, setSelectedBatchId] = React.useState(null);
    const [activeSelectedIndex, setActiveSelectedIndex] = React.useState(null);
    const [completeSelectedIndex, setCompleteSelectedIndex] = React.useState(null);
    const [selectedTab, setSelectedTab] = React.useState("ActiveBatches");

    //new user batch
    const [createdBatch, errorBatchCreate, loadingBatchCreate, axiosFetchBatchCreate] = useAxiosFunction();

    const handleRemoveBatch = (batch) => {
        onRemoveHandler(batch);
    }

    //New Batch
    const handleNewBatch = () => {
        axiosFetchBatchCreate({
            axiosInstance: axiosPrivate,
            method: 'POST',
            url: '/Batches/Create'
        });
    }
    React.useEffect(() => {
        if (!loadingBatchCreate && createdBatch != '') {
            handleNewDispatch(createdBatch);
            setSelectedBatchId(createdBatch.id);
        }
        if (errorBatchCreate) {
        }
    }, [loadingBatchCreate])

    //Toggle Active/Complete tabs
    const handleTabChange = (e, newValue) => {
        setSelectedTab(newValue);
    };

    const handleListItemClick = (index, id) => {
        onBatchIdChange(id);
        let batch = batches.find(b => b.id == id);
        if (batch != null) {
            if (!batch.isComplete) {
                setActiveSelectedIndex(index);
                setCompleteSelectedIndex(null);
                setSelectedTab("ActiveBatches");
            }
            else {
                setCompleteSelectedIndex(index);
                setActiveSelectedIndex(null);
                setSelectedTab("CompleteBatches");
            }
            handleDrawerToggle(false);
            sessionStorage.setItem("selectedBatchId", id);
            setSelectedBatchId(id);
        }
    };

    //When batches have loaded...
    React.useEffect(() => {
        if (loadingBatches == false && batches.length > 0) {
            const activeBatchIds = batches.filter(b => b.isComplete == false).map(a => a.id);
            const completeBatchIds = batches.filter(b => b.isComplete == true).map(c => c.id);

            //...if no selected batch is set in session storage and active batches finished loading, set it to the first active.
            if (selectedBatchId != null) {
                if (activeBatchIds.includes(selectedBatchId)) {
                    handleListItemClick(activeBatchIds.indexOf(selectedBatchId), selectedBatchId, true);
                }
                else if (completeBatchIds.includes(selectedBatchId)) {
                    handleListItemClick(completeBatchIds.indexOf(selectedBatchId), selectedBatchId, false);
                }
                else { //this is possible if someone else was previously logged in, or if the user messes with localStorage.
                    selectFirstBatch(activeBatchIds);
                }
            }
            if (selectedBatchId === null) {
                selectFirstBatch(activeBatchIds);
            }

        }
    }, [loadingBatches, batches, selectedBatchId])

    const selectFirstBatch = (activeBatchIds) => {
        //set active if any active, otherwise first in list.
        if (activeBatchIds.length > 0) {
            setSelectedBatchId(batches.filter(b => b.isComplete == false)[0].id);
            sessionStorage.setItem("selectedBatchId", activeBatchIds[0]);
        }
        else {
            setSelectedBatchId(batches[0].id)
            sessionStorage.setItem("selectedBatchId", activeBatchIds[0]);
        }
    }

    return (
        <Drawer
            open={drawerOpen}
            onClose={() => { handleDrawerToggle(false) }}
        >
            <Box sx={{ width: 300 }}>
                <TabContext value={selectedTab} >
                    <TabList
                        onChange={handleTabChange}
                        TabIndicatorProps={{ sx: { backgroundColor: 'transparent', height: 1 } }}
                        sx={{
                            "& button": { borderRadius: 5 },
                            "& button:hover": { backgroundColor: 'darkslategrey' },
                            "& .Mui-selected": { backgroundColor: '#121212' }
                        }}
                        variant="fullWidth"
                        aria-label="lab API tabs example">
                        <Tab label="Active" value="ActiveBatches" />
                        <Tab label="Complete" value="CompleteBatches" />
                    </TabList>
                    <Divider />
                    {!loadingBatches &&
                        <Grid container sx={{}}>
                            <TabPanel value="ActiveBatches" sx={{ p: 1, pt: 1.5, width: '100%' }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    color="success"
                                    onClick={handleNewBatch}
                                //sx={{ color: "darkslategrey", backgroundColor: "darkslategrey" }}
                                >
                                    <b>NEW BATCH</b>
                                </Button>
                                <List sx={{ width: '100%' }}>
                                    {batches.filter(b=>b.isComplete==false).length > 0 &&
                                        batches.filter(b => b.isComplete == false).map((b, index) => (
                                            <BatchCard
                                                key={b.id}
                                                batch={b}
                                                index={index}
                                                selectedIndex={activeSelectedIndex}
                                                handleListItemClick={handleListItemClick}
                                                onRemoveHandler={handleRemoveBatch}
                                            />
                                        ))
                                    }
                                </List>
                            </TabPanel>
                            <TabPanel value="CompleteBatches" sx={{ p: 1, pt: 1.5, width: '100%' }}>
                                <List className="BatchList">
                                    {batches.filter(b => b.isComplete == true).length > 0 &&
                                        batches.filter(b => b.isComplete == true).map((b, index) => (
                                            <BatchCard
                                                key={b.id}
                                                batch={b}
                                                index={index}
                                                selectedIndex={completeSelectedIndex}
                                                handleListItemClick={handleListItemClick}
                                                onRemoveHandler={handleRemoveBatch}
                                            />
                                        ))
                                    }
                                </List>
                            </TabPanel>
                        </Grid>
                    }
                    {loadingBatches &&
                        <Grid container align="center" justifyContent="center">
                            <Grid item>
                                <CircularProgress />
                            </Grid>
                        </Grid>
                    }
                </TabContext>
            </Box>
        </Drawer>
    );

}