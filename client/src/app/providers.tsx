"use client"

import StoreProvider from "@/state/redux";
import Auth from "./(auth)/AuthProvider";
import {Authenticator} from "@aws-amplify/ui-react"

const Providers = ({ children }: {children: React.ReactNode}) => {
    return(
        <StoreProvider>
            <Authenticator.Provider>
                <Auth>{children}</Auth>
            </Authenticator.Provider>
        </StoreProvider>
    );
}

export default Providers;