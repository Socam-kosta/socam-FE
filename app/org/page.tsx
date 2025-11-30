import { Suspense } from "react";
import OrgPageClient from "./OrgPageClient";

export default function Page() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <OrgPageClient />
      </Suspense>
  );
}
