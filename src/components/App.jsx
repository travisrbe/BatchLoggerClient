import * as React from 'react';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import AppWrapper from './AppWrapper';
import Share from './Share';

//flexwrap
//grids 1FR layouts
//maybe MUI grid at higher level, too
//mediaqueries (parent, sibling)
//design for one-column mobile that expands to more columms
//            sx={{ display: 'flex', height: '100vh', width: '100vw', }}>

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <AppWrapper />,
        },
        {
            path: "/share/:id",
            element: <Share />,
        },
    ])

    return (
        <RouterProvider router={router} />
    )

    //return (
    //    <React.Fragment>
    //            <AuthProvider>
    //                <SignInWrapper />
    //            </AuthProvider>
    //    </React.Fragment>
    //);
}