import TradingViewWidget from "./tradingViewWidget";


export default function Home() {
  return (
    <div>
      <main className="p-8">
        <div className="h-[500px]">
          <TradingViewWidget symbol="NASDAQ:AAPL" />
        </div>
      </main>
    </div>
  );
}