# Genetics

## Run the backend safely

From the project root, use a narrow reload watch so Uvicorn does not watch
`node_modules`, virtual environments, build output, or generated upload files:

```bash
python3 -m uvicorn app.main:app --reload --reload-dir backend/app --port 8000
```

If port `8000` is busy, use another port:

```bash
python3 -m uvicorn app.main:app --reload --reload-dir backend/app --port 8002
```

## Run the frontend

```bash
cd frontend
npm run dev
```
