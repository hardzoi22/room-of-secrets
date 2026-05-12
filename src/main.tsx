import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GuardianRouter from "./GuardianRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GuardianRouter />
  </StrictMode>
);
