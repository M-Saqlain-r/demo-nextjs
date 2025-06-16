'use client'
import AllUsersTable from "@/components/data-table";

export default function Page() {
  // const data = await getSections();

  return (
    <>
      {/* <SiteHeader /> */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">

          <AllUsersTable />
        </div>

      </div>
    </>
  );
}
