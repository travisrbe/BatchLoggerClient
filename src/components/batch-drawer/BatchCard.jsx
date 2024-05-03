import * as React from 'react';
import moment from 'moment';
import {
    Card,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    Tooltip
} from '@mui/material/'
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function BatchCard({ batch, index, selectedIndex, handleListItemClick, onRemoveHandler }) {
    const [removeConfirm, setRemoveConfirm] = React.useState(false);

    const handleRemoveClickAway = () => {
        setRemoveConfirm(false);
    }

    const handleRemoveBatch = (batch) => {
        onRemoveHandler(batch);
    }

    return (
        <ListItem disablePadding >
            <ClickAwayListener onClickAway={handleRemoveClickAway}>
                <Tooltip title="Delete from Stack" enterDelay={1000} enterNextDelay={1000} placement="bottom">
                    <span>
                        {!removeConfirm
                            ? <IconButton
                                aria-label="delete"
                                color="warning"
                                //disabled={disabled}
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
                                    handleRemoveBatch({ ...batch });
                                }}
                            >
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        }
                    </span>
                </Tooltip>
            </ClickAwayListener>
            <Card elevation={10}
                className="ListItemButtonPaperWrapper"
                sx={{
                    width: '100%',
                    padding: .5,
                    mt: .5,
                    mb: .5,
                    borderRight: 2,
                    borderBottom: 2,
                    borderColor: 'darkslategrey',
                }}>
                <ListItemButton
                    sx={{
                        //here to keep list items same size
                        borderTop: 2,
                        borderColor: 'transparent',
                        '&.Mui-selected': {
                            //color:'#90caf9',
                            borderTop: 2,
                            borderColor: '#66bb6a',
                            backgroundColor: '#121212',
                        },
                        "&:hover": {
                            backgroundColor: 'darkslategrey'
                        }
                    }}
                    dense
                    selected={selectedIndex === index}
                    onClick={(event) => { handleListItemClick(index, batch.id); }}
                >
                    <ListItemText>
                        {moment(batch.createDate, moment.ISO_8601).format("LL")} <br />
                        "{(batch.name.length > 20
                            ? batch.name.slice(0, 25) + "..."
                            : batch.name)}"
                    </ListItemText>
                </ListItemButton>
            </Card>
        </ListItem>
    )
}
export default BatchCard;