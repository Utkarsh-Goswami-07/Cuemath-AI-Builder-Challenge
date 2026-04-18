import React from "react";
import { Toaster } from "react-hot-toast";
import Studio from "./pages/Studio";
import "./styles/globals.css";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            background: "var(--brand-navy)",
            color: "white",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#FF6B35", secondary: "white" } },
          error: { iconTheme: { primary: "#FF4444", secondary: "white" } },
        }}
      />
      <Studio />
    </>
  );
}

export default App;
