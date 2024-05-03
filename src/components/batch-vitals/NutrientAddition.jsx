import * as React from 'react';

import {
    Card,
    Grid,
    IconButton,
    TextField,
    Tooltip,
} from '@mui/material/';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function NutrientAddition({ nuAdd, disabled, dirtyBit, onChangeHandler, onRefreshHandler, onRemoveHandler }) {
    const [refreshConfirm, setRefreshConfirm] = React.useState(false);
    const [removeConfirm, setRemoveConfirm] = React.useState(false);

    const handleRefreshClickAway = () => {
        setRefreshConfirm(false);
    }
    const handleRemoveClickAway = () => {
        setRemoveConfirm(false);
    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} align="center">
                    <Card elevation={10}
                        sx={{
                            p: 1,
                            mb: 1,
                            borderRight: 2,
                            borderBottom: 2,
                            borderColor: 'darkslategrey',
                            //border: '2px solid green',
                            //bgcolor: '#e0e0e0'
                        }}>
                        <input type="hidden" id="nu-add-id" name="Nutrient Addition Id" value={nuAdd.id}></input>
                        <input type="hidden" id="nutrient-id" name="Nutrient Id" value={nuAdd.nutrientId}></input>
                        <Grid container spacing={0} pb={1} align="center" alignItems="center">

                            <Grid item xs={12} sm={2} md={12} lg={2} container justifyContent="center">
                                <Grid container spacing={0}>
                                    <Grid item xs={6} sm={12} md={6} lg={12} container justifyContent="center">
                                        <ClickAwayListener onClickAway={handleRefreshClickAway}>
                                            <Tooltip title="Restore Defaults" enterDelay={1000} enterNextDelay={1000} placement="top">
                                                <span>
                                                    {!refreshConfirm
                                                        ? <IconButton
                                                            color="warning"
                                                            disabled={disabled}
                                                            onClick={(e) => {
                                                                setRefreshConfirm(true);
                                                            }}
                                                        >
                                                            <RefreshIcon />
                                                        </IconButton>
                                                        : <IconButton
                                                            color="error"
                                                            onClick={(e) => {
                                                                onRefreshHandler({ ...nuAdd });
                                                            }}
                                                        >
                                                            <RefreshIcon />
                                                        </IconButton>
                                                    }
                                                </span>
                                            </Tooltip>
                                        </ClickAwayListener>
                                    </Grid>
                                    <Grid item xs={6} sm={12} md={6} lg={12} container justifyContent="center">
                                        <ClickAwayListener onClickAway={handleRemoveClickAway}>
                                            <Tooltip title="Delete from Stack" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                                                <span>
                                                    {!removeConfirm
                                                        ? <IconButton
                                                            aria-label="delete"
                                                            color="warning"
                                                            disabled={disabled}
                                                            onClick={(e) => {
                                                                setRemoveConfirm(true);
                                                            }}
                                                        >
                                                            <RemoveCircleOutlineIcon />
                                                        </IconButton>
                                                        : <IconButton
                                                            aria-label="delete"
                                                            color="error"
                                                            onClick={(e) => {
                                                                onRemoveHandler({ ...nuAdd });
                                                            }}
                                                        >
                                                            <RemoveCircleOutlineIcon />
                                                        </IconButton>
                                                    }
                                                </span>
                                            </Tooltip>
                                        </ClickAwayListener>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={10} md={12} lg={10} container justifyContent="center">
                                <Grid container spacing={1} pt={1}>
                                    <Grid item xs={4}>
                                        <TextField
                                            error={(nuAdd.nameOverride?.length > 0) ? false : true}
                                            size="small"
                                            autoComplete="off"
                                            spellCheck="false"
                                            fullWidth
                                            required
                                            disabled={disabled}
                                            onChange={(e) => {
                                                onChangeHandler({
                                                    ...nuAdd,
                                                    nameOverride: e.target.value
                                                });
                                            }}
                                            value={nuAdd.nameOverride}
                                            name="NutrientName"
                                            id="nutrient-name"
                                            label="Nutrient"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            error={dirtyBit && !disabled}
                                            size="small"
                                            fullWidth
                                            disabled
                                            value={(nuAdd.gramsToAdd == null) ? "Add Grams" : nuAdd.gramsToAdd}
                                            name="GramsToAdd"
                                            id="grams-to-add"
                                            label="Add (Grams)"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            error={dirtyBit && !disabled}
                                            size="small"
                                            fullWidth
                                            disabled
                                            value={(nuAdd.yanPpmAdded == null) ? "Subtotal N PPM" : nuAdd.yanPpmAdded}
                                            name="YanPpmAdded"
                                            id="yan-ppm-added"
                                            label="Subtotal N PPM"
                                        />
                                    </Grid>
                                    {/*OPTIONAL ROWS*/}
                                    <Grid item xs={4}>
                                        <TextField
                                            size="small"
                                            autoComplete="off"
                                            fullWidth
                                            type="number"
                                            //required
                                            disabled={disabled}
                                            onChange={(e) => {
                                                onChangeHandler({
                                                    ...nuAdd,
                                                    maxGramsPerLiterOverride: e.target.value == null ? '' : e.target.value
                                                });
                                            }}
                                            //DO NOT CHANGE THESE WITHOUT LOOKING AT THE REDUCER AND NUTRIENT STACK
                                            //REACT DOES NOT HANDLE NULL NUMERIC VERY WELL
                                            value={nuAdd.maxGramsPerLiterOverride == null ? '' : nuAdd.maxGramsPerLiterOverride}
                                            name="Max g/L"
                                            id="max-g-per-l"
                                            label="Max g/L"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            size="small"
                                            autoComplete="off"
                                            type="number"
                                            fullWidth
                                            required
                                            disabled={disabled}
                                            onChange={(e) => {
                                                onChangeHandler({
                                                    ...nuAdd,
                                                    yanPpmPerGramOverride: e.target.value == null ? '' : e.target.value
                                                });
                                            }}
                                            //DO NOT CHANGE THESE WITHOUT LOOKING AT THE REDUCER AND NUTRIENT STACK
                                            //REACT DOES NOT HANDLE NULL NUMERIC VERY WELL
                                            value={nuAdd.yanPpmPerGramOverride == null ? '' : nuAdd.yanPpmPerGramOverride}
                                            name="YAN PPM / g"
                                            id="yan-ppm-per-gram"
                                            label="Yan PPM/g/L"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            size="small"
                                            autoComplete="off"
                                            type="number"
                                            fullWidth
                                            //required
                                            disabled={disabled}
                                            onChange={(e) => {
                                                onChangeHandler({
                                                    ...nuAdd,
                                                    effectivenessMutiplierOverride: e.target.value
                                                });
                                            }}
                                            value={nuAdd.effectivenessMutiplierOverride}
                                            name="EffectivenessMutiplier"
                                            id="effectiveness-multiplier"
                                            label="Effectiveness"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}