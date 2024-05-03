import * as React from 'react';

import {
    Button,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material/';

import AddIcon from '@mui/icons-material/Add';

export default function NuAddDropdown({ nutrients, handleSubmit, disabled }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (id) => {
        if (id?.length > 0) {
            handleSubmit(id);
        }
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Tooltip title="Add Nutrient (Menu)" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                <span>
                    <Button
                        id="basic-button"
                        onClick={handleClick}
                        disabled={disabled}
                        fullWidth
                        sx={{ pt: 0 }}
                        color="success"
                        variant="outlined"
                    >
                        Add
                    </Button>
                </span>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {nutrients.map
                    (
                        (nutrient) => {
                            return (
                                <MenuItem
                                    key={nutrient.id}
                                    onClick={() => handleClose(nutrient.id)}>
                                    {nutrient.manufacturer} {nutrient.name}
                                </MenuItem>
                            )
                        }
                    )

                }
            </Menu>
        </React.Fragment>
    )
}