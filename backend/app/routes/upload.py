from app.services.medical_ai import generate_medical_insights
from fastapi import APIRouter, UploadFile, File
import os

from app.services.analyzer import analyze_genomic_data
from app.services.insight_generator import generate_insights

router = APIRouter()

UPLOAD_FOLDER = "app/datasets"


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    allowed_extensions = [".csv", ".vcf"]

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        return {
            "status": "error",
            "message": "Only CSV and VCF files are allowed"
        }

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Genomic analysis
    analysis_result = analyze_genomic_data(file_path)

    # AI insights
    insight_result = generate_insights(analysis_result)

    return {
        "status": "success",
        "filename": file.filename,
        "dataset_summary": analysis_result,
        "ai_insights": insight_result["insights"]
    }