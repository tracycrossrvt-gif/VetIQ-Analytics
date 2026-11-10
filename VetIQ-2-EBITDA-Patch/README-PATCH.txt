VetIQ 2.0 — EBITDA margin and label polish patch

Apply ONLY after the initial VetIQ 2.0 refresh package is installed.
Extract the contents of this ZIP into the existing VetIQ repository root and replace matching files.

Files modified: src/app/DashboardContext.jsx, src/pages/Overview.jsx, src/pages/Costs.jsx, src/pages/DataEntry.jsx, src/App.css

New optional field: Other operating expenses. EBITDA margin remains Not set until a value is provided. Zero is allowed only if truly accurate.
This is an estimate, not an accounting-verified EBITDA measure.
Current saved monthly data uses the same localStorage key.

Run npm run build, then npm run dev and test Data Entry > Overview > Cost & Labor.
This patch does not implement rolling historical data or PY/CY comparisons.
