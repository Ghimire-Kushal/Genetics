from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import json
import os
from pathlib import Path
import uuid

from app.services.analyzer import analyze_genomic_data
from app.services.insight_generator import generate_insights
from app.services.medical_ai import generate_medical_insights

router = APIRouter()

BACKEND_ROOT = Path(__file__).resolve().parents[2]
STORAGE_ROOT = Path(os.getenv("GSCOPE_STORAGE_DIR", BACKEND_ROOT / "storage"))
UPLOAD_FOLDER = STORAGE_ROOT / "datasets"
RESULTS_FOLDER = STORAGE_ROOT / "results"
LEGACY_RESULTS_FOLDER = BACKEND_ROOT / "app" / "datasets" / "results"

ALLOWED_EXTENSIONS = [".csv", ".vcf"]
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


def save_analysis_result(analysis_id, payload):
    RESULTS_FOLDER.mkdir(parents=True, exist_ok=True)
    result_path = RESULTS_FOLDER / f"{analysis_id}.json"

    with open(result_path, "w", encoding="utf-8") as result_file:
        json.dump(payload, result_file)


def load_analysis_result(analysis_id):
    result_path = RESULTS_FOLDER / f"{analysis_id}.json"

    if not result_path.exists():
        legacy_result_path = LEGACY_RESULTS_FOLDER / f"{analysis_id}.json"
        if not legacy_result_path.exists():
            return None
        result_path = legacy_result_path

    with open(result_path, "r", encoding="utf-8") as result_file:
        return json.load(result_file)


def build_fallback_summary(analysis_result):
    mutation_columns = analysis_result.get("detected_mutation_columns", [])
    variants_found = len(mutation_columns)

    if variants_found >= 2:
        return {
            "disease": "Mutation-associated genomic risk",
            "risk_level": "Moderate",
            "confidence": "78%",
            "recommendation": (
                "Mutation-related columns were detected. Review the variants with a genetics "
                "specialist and consider confirmatory clinical testing."
            )
        }

    if variants_found == 1:
        return {
            "disease": "Possible genomic variant signal",
            "risk_level": "Low",
            "confidence": "64%",
            "recommendation": (
                "One mutation-related column was detected. Continue analysis with a larger "
                "dataset or validated variant annotation source."
            )
        }

    return {
        "disease": "No clear disease signal detected",
        "risk_level": "Low",
        "confidence": "52%",
        "recommendation": (
            "No mutation-specific columns were detected in this upload. Verify the file format "
            "and include gene or mutation annotations for stronger interpretation."
        )
    }


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    try:
        # Create upload folder
        UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

        # Validate extension
        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension not in ALLOWED_EXTENSIONS:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": "Only CSV and VCF files are allowed"
                }
            )

        # Read file
        content = await file.read()

        # Validate size
        if len(content) > MAX_FILE_SIZE:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": "File exceeds 50 MB limit"
                }
            )

        # Generate unique filename
        analysis_id = uuid.uuid4().hex
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"

        file_path = UPLOAD_FOLDER / unique_filename

        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # Step 1 — Genomic analysis
        analysis_result = analyze_genomic_data(file_path)

        # Step 2 — AI insights
        insight_result = generate_insights(analysis_result)
        fallback_summary = build_fallback_summary(analysis_result)

        # Step 3 — Medical disease prediction
        try:
            medical_summary = generate_medical_insights(analysis_result)
        except Exception:
            medical_summary = {
                **fallback_summary,
                "recommendation": (
                    f"{fallback_summary['recommendation']} Automated medical insight generation "
                    "is temporarily unavailable, but dataset analysis completed successfully."
                )
            }

        if isinstance(medical_summary, dict):
            summary = {**fallback_summary, **medical_summary}
        else:
            summary = {
                **fallback_summary,
                "recommendation": str(medical_summary) if medical_summary else "No recommendation available"
            }

        response_payload = {
                "success": True,
                "message": "Genome analyzed successfully",
                "upload_id": analysis_id,
                "analysis_id": analysis_id,

                "file": {
                    "original_name": file.filename,
                    "stored_name": unique_filename,
                    "size_bytes": len(content),
                    "extension": file_extension
                },

                "summary": {
                    "disease": summary.get("disease", "Unknown"),
                    "risk_level": summary.get("risk_level", "Unknown"),
                    "confidence": summary.get("confidence", "0%"),
                    "variants_found": len(analysis_result.get("detected_mutation_columns", [])),
                    "recommendation": summary.get("recommendation", "No recommendation available")
                },

                "dataset_summary": analysis_result,

                "ai_insights": insight_result.get("insights", [])
            }

        save_analysis_result(analysis_id, response_payload)

        return JSONResponse(
            status_code=200,
            content=response_payload
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal server error",
                "error": str(e)
            }
        )


@router.post("/analyze")
async def analyze_upload(data: dict):
    analysis_id = data.get("analysis_id") or data.get("upload_id")

    if not analysis_id:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Missing analysis_id or upload_id"
            }
        )

    result = load_analysis_result(analysis_id)

    if not result:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Analysis result not found"
            }
        )

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "analysis_id": analysis_id,
            "status": "completed"
        }
    )


@router.get("/results")
async def get_results(analysis_id: str = None):
    if not analysis_id:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Missing analysis_id"
            }
        )

    result = load_analysis_result(analysis_id)

    if not result:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Analysis result not found"
            }
        )

    return JSONResponse(
        status_code=200,
        content=result
    )


@router.get("/results/{analysis_id}")
async def get_result_by_id(analysis_id: str):
    return await get_results(analysis_id)
