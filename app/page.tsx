/**
 * Home Page
 *
 * Entry point of the app. Simply renders the StockDashboard component.
 */

import StockDashboard from "./stockDashboard";

export default function Home() {
  return (
    <div>
      <StockDashboard/>
    </div>
  );
}