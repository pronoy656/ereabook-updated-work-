import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-black dark:text-white transition-colors">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-8 flex-1 bg-[#F8FAFC] dark:bg-[#0f172a] transition-colors">{children}</main>
      </div>
    </div>
  );
}
