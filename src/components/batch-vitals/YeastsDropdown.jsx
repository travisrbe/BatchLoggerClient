import * as React from 'react';

import {
    Autocomplete,
    Box,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material/';

export default function YeastsDropdown({ yeasts, handleYeastChange, selectedYeastId, disabled }) {

    return (
        <React.Fragment>
            <Autocomplete
                id="yeast-select-autocomplete"
                autoComplete={true}
                disabled={disabled}
                required
                fullWidth
                autoHighlight
                options={yeasts}
                value={yeasts.find((yeast) => yeast.id === selectedYeastId)}
                onChange={(_, v) => handleYeastChange(v?.id)}
                getOptionLabel={(yeast) => yeast.manufacturer + " " + yeast.name }
                renderOption={(props, yeast) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {yeast.manufacturer} {yeast.name} 
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        required
                        size="small"
                        label="Yeast"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'off'
                        }}
                    />
                )}
            />
        </React.Fragment>
    )
}