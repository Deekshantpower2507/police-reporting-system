# N.C.R.S. (National Cybercrime Reporting System)
## Project Update & Feature Report
**Date:** September 2026
**Location Context:** Gwalior, Madhya Pradesh

---

### 1. Project Rebranding & Localization
- **Name Change:** The system has been fully rebranded from "Secure.Block" to **N.C.R.S. (National Cybercrime Reporting System)** to reflect a realistic, government-standard naming convention.
- **Gwalior Integration:** The entire system has been localized to Gwalior. 
  - GPS Maps now default to Gwalior coordinates (26.2183, 78.1828).
  - The Police Station database was updated to feature real Gwalior districts (Gwalior HQ, Maharajpura Station, Hazira Station, University Station, Lashkar Station, Behat Station).
  - The database was seeded with 30 real Gwalior Police Officers (including SP Dharmveer Singh, Addl. SP Dr. Shivesh Singh Baghel, etc.) for realistic Admin assignments.

### 2. Advanced Feature Implementations

#### A. AI CyberCop Auto-Filer (NLP Assistant)
Integrated an AI-powered chatbot assistant on the Citizen Report page. Citizens can describe incidents in natural language (e.g., "My Facebook was hacked yesterday..."), and the NLP engine automatically parses the text, extracts the crime type, sets the threat priority, and auto-populates the official reporting form.

#### B. SOS Panic Button
Added a high-visibility, single-click SOS Panic Button to the Citizen Dashboard. When clicked, it bypasses the 4-step reporting form, triggers a red warning overlay, captures the user's GPS coordinates, and instantly dispatches a "CRITICAL" priority emergency alert directly to the central police database.

#### C. Real-Time SMS Simulator Widget
Developed a dynamic, iPhone-styled SMS Widget on the Citizen Dashboard. It visually mimics real-time government text message alerts, instantly updating citizens when their cases are successfully filed, assigned to an officer, investigated, or resolved.

#### D. Public Safety Heatmap
Implemented a live, interactive React-Leaflet map accessible to the public. It visualizes reported crime data across the Gwalior region using glowing red/orange/green hotspots based on crime density and resolution status, raising public awareness of high-risk areas.

#### E. Dark Web Threat Scanner
Integrated a mock OSINT (Open Source Intelligence) Dark Web Scanner UI on the dashboard. It simulates scanning the dark web for compromised citizen data, enhancing the system's focus on proactive cybersecurity.

#### F. AI Suspect Face Generator
Integrated Pollinations API on the incident report form. Based on physical descriptions provided by victims, the system auto-generates a realistic, pencil-style composite sketch of the suspect.

#### G. Dynamic "Threat Level" (DEFCON System)
Added a real-time, pulsing Threat Level banner to both the Admin and Police Dashboards. The system calculates a threat tier (DEFCON 5 NORMAL, DEFCON 3 ELEVATED, DEFCON 2 CRITICAL) automatically based on the volume of new, unresolved, and active cases in the SQLite database.

#### H. Official E-FIR PDF Auto-Generator
Converted the standard complaint details page into a printable Official Document. By injecting specialized CSS `print` media queries, users can download a formally structured E-FIR complete with Madhya Pradesh Police header logos, legal footers, and simulated cryptographic verification hashes.

#### I. IPC Legal Oath & Digital Signatures
Enhanced the final submission step of the E-FIR. Citizens are now legally bound to accept the IPC Section 182 disclaimer (against false reporting) and must provide a digital text-based signature before the system allows the FIR to be transmitted.

#### J. Interactive Mock OTP Verification
Integrated a mock Two-Factor Authentication (OTP) layer during user registration. Citizens must input a 6-digit verification code to complete their account creation, simulating real-world identity verification protocols.

### 3. Core System Fixes
- **Database Architecture:** Migrated the backend successfully to SQLite for seamless local execution and resolved critical primary key `_id` vs `id` assignment bugs during the Admin officer assignment process.
- **Routing:** Corrected Vercel SPA routing configurations (`vercel.json`) to prevent 404 errors during cloud deployments.
- **UI/UX Cleanup:** Removed legacy placeholder elements (e.g., "Sector 7" mock alerts) and cleaned up Citizen vs. Admin privileges to ensure logical workflows.

---
*Report auto-generated for project presentation and review.*
