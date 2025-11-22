import StockDashboard from "./stockDashboard";

export default function Home() {
  return (
    <div>
      <main className="p-8">
        <div className="h-[500px]">
          <StockDashboard/>
        </div>
      </main>
    </div>
  );
}