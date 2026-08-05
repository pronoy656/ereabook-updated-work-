import Sidebar from "@/components/consultant/Sidebar";
import TopBar from "@/components/consultant/TopBar";
import IncomingCallListener from "@/components/consultant/IncomingCallListener";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <IncomingCallListener />
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-6 flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
}
