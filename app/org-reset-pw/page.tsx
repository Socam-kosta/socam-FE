import { Suspense } from "react";
import ResetPwClient from "./ResetPwClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPwClient />
        </Suspense>
    );
}