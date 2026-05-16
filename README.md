# CarbonX MVP

CarbonX is a hackathon MVP that helps smallholder farmers register farm boundaries and receive an NDVI-based carbon credit estimate.

## Run Locally

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Demo Flow

1. Register a farmer account, for example `Ramaiah`.
2. Draw a polygon around farm land near Warangal, Telangana.
3. Submit the farm.
4. The dashboard shows area, mock NDVI, tCO2e, and estimated INR earnings.

## Notes

- The MVP uses deterministic mock NDVI for reliable demos.
- Local persistence uses SQLite with a Postgres-friendly data model. GeoJSON is stored as JSON text so PostGIS can replace it later.
- Sentinel Hub credential placeholders are wired through environment variables for a future live NDVI service.
