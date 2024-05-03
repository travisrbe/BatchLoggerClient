import { createContext, useReducer } from 'react';
import NuAddsReducer from '../reducers/NuAddsReducer.js';

export const NuAddsContext = createContext(null);
export const NuAddsDispatchContext = createContext(null);

//Note: check out race conditions and Context
//Use recorder in chrome to see if I can trigger race error
export const NuAddsProvider = ({ children }) => {
    const [nuAdds, dispatch] = useReducer(NuAddsReducer, []);

    return (
        <NuAddsContext.Provider value={nuAdds}>
            <NuAddsDispatchContext.Provider value={dispatch}>
                {children}
            </NuAddsDispatchContext.Provider>
        </NuAddsContext.Provider>
    );
};