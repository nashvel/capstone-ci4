import React from "react";
import "./appDownload.css";
import { assets } from "../../assets/assets";

function AppDownload() {
  return (
    <>
      <div className="app-download" id="app-download">
        <p>
          For a Better Experience,<br />
          Download The Multi Cuisine App
        </p>

        <div className="app-download-platform">
          <img src={assets.play_store} alt="android" />
        </div>
      </div>
    </>
  );
}

export default AppDownload;
