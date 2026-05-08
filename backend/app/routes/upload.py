from fastapi import APIRouter, UploadFile, File
import os
from app.services.analyzer import analyze_genomic_data

router = APIRouter()

UPLOAD_FOLDER = "app/datasets"

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Create folder if not exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Check extension
    allowed_extensions = [".csv", ".vcf"]

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        return {
            "status": "error",
            "message": "Only CSV and VCF files are allowed"
        }

    # Save file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Analyze file
    analysis_result = analyze_genomic_data(file_path)

    return {
        "status": "success",
        "filename": file.filename,
        "analysis": analysis_result
    }