import * as React from 'react';

import SignInWrapper from './sign-in/SignInWrapper';
import { AuthProvider } from '../context/AuthProvider';

export default function AppWrapper() {
    

    return (
        //flexwrap
        //grids 1FR layouts
        //maybe MUI grid at higher level, too
        //mediaqueries (parent, sibling)
        //design for one-column mobile that expands to more columms
        //            sx={{ display: 'flex', height: '100vh', width: '100vw', }}>
        
        <AuthProvider>
            <SignInWrapper />
        </AuthProvider>
    );
}