import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
// import { userLogin, UserState } from "./store/slices/UserSlice";
import { AppStore, makeStore } from "./store/store";
import { login } from "./store/slice/AdminSlice";
import { Admin } from "./utils/constants";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>(makeStore());

    useEffect(() => {
        const adminJson = localStorage.getItem("admin");

        if (adminJson) {
            const admin: Admin = JSON.parse(adminJson);
            // console.log("UserJOSN : ", user);
            storeRef.current?.dispatch(login(admin));
        }

    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}