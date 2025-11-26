import { Suspense } from "react";
import LecturesClient from "./LecturesClient";

export default function Page() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <LecturesClient />
      </Suspense>
  );
}
