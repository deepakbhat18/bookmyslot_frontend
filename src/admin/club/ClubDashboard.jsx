import { useParams, Outlet } from "react-router-dom";
import { useState } from "react";

import ClubEvents from "./ClubEvents";
import ClubAnalytics from "./ClubAnalytics";

import "../../styles/ClubDashboard.css";

export default function ClubDashboard() {
  const { clubId } = useParams();

  
  const [tab, setTab] = useState("EVENTS");

  return (
    <div className="club-dashboard">
      <h1 className="club-title">Club Dashboard</h1>

      <div className="club-tabs">
        <button
          className={tab === "EVENTS" ? "active" : ""}
          onClick={() => setTab("EVENTS")}
        >
          Events
        </button>

     

        <button
          className={tab === "ANALYTICS" ? "active" : ""}
          onClick={() => setTab("ANALYTICS")}
        >
          Analytics
        </button>
      </div>

 
      <div className="club-content">
        {tab === "EVENTS" && <ClubEvents />}
    
        {tab === "ANALYTICS" && <ClubAnalytics />}

       
        <Outlet />
      </div>
    </div>
  );
}
