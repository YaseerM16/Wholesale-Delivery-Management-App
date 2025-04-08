import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store/store";
import { login } from "./store/slice/AdminSlice";
import { login as driverLogin } from "./store/slice/DriverSlice"
import { Admin } from "./utils/constants";
import { IDriver } from "./utils/driver.types";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>(makeStore());

    useEffect(() => {
        const adminJson = localStorage.getItem("admin");
        const driverJson = localStorage.getItem("driver");

        if (adminJson) {
            const admin: Admin = JSON.parse(adminJson);
            storeRef.current?.dispatch(login(admin));
        }

        if (driverJson) {
            const driver: IDriver = JSON.parse(driverJson);
            storeRef.current?.dispatch(driverLogin(driver));
        }

    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}