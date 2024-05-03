import * as React from 'react';
import {
    Divider,
    Grid,
    Tab,
} from '@mui/material/';
import {
    TabList,
    TabContext,
    TabPanel
} from '@mui/lab/';
import Logbook from './Logbook'

function TabbedCenter({ batchId, userChosenName }) {

    const [selectedTab, setSelectedTab] = React.useState("Logbook");

    const handleChange = (e, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <React.Fragment>
            <TabContext
                value={selectedTab}
            >
                {/*<Divider />*/}
                <TabList
                    onChange={handleChange}
                    TabIndicatorProps={{ sx: {backgroundColor: 'transparent', height:1} }}
                    sx={{
                        "& button": { borderRadius: 5 },
                        "& button:hover": { backgroundColor: 'darkslategrey' },
                        "& .Mui-selected": { backgroundColor: '#121212' },
                        m:2
                    }}
                    variant="fullWidth"
                    aria-label="tabbed-center">
                    <Tab label="Logbook" value="Logbook" />
                    <Tab label="Tools" value="Tools" />
                    <Tab label="Wiki" value="Wiki" />
                </TabList>
                <Divider sx={{m:2}} />
                <TabPanel value="Logbook" sx={{ pr: 2, pl: 2, pt: 1}}> 
                    {(batchId != null && batchId != undefined) && 
                        <Logbook
                            batchId={batchId}
                            userChosenName={userChosenName}>
                        </Logbook>
                    }
                </TabPanel>
                <TabPanel value="Tools" sx={{ p: 1, m:2 }}>
                    Later.
                </TabPanel>
                <TabPanel value="Wiki" sx={{ p: 1, m: 2 }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <iframe src="https://meadmaking.wiki/en/home" title="MeadWiki" width="100%" height="700"></iframe>
                        </Grid>
                    </Grid>
                </TabPanel>
            </TabContext>
        </React.Fragment>
    );
}

export default TabbedCenter;