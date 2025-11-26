import { Suspense } from "react";
import UserResetPwClient from "./UserResetPwClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserResetPwClient />
        </Suspense>
    );
}
