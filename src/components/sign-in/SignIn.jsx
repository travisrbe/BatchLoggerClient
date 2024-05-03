import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function SignIn({ onSubmit, email, password, rememberMe, onEmailChange, onPasswordChange, onRememberMeChange, onToggleRegister, errorMessage }) {

    return (

        <Container component="main" maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '90vw',
                height: '90vh',
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'red' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign In
            </Typography>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoFocus
                            value={email}
                            onChange={(e) => {
                                onEmailChange(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            autoComplete="off"
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                onPasswordChange(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox value={rememberMe} color="primary" checked={rememberMe} onChange={onRememberMeChange} />}
                            label="Remember me"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                <Button
                    variant="outlined"
                    sx={{ mt: 5 }}
                    fullWidth
                    onClick={() => {
                        onToggleRegister();
                    }}>
                    Switch to Register
                </Button>
            </Box>
            <Typography
                variant="h6"
                sx={{ color: "red" }}
            >
                {errorMessage}
            </Typography>


        </Container>
    );
}