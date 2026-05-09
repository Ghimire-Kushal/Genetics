from fastapi import APIRouter

from app.services.dna_analyzer import analyze_dna_sequence

router = APIRouter()


@router.post("/dna/analyze")
async def analyze_dna(data: dict):

    sequence = data.get("sequence", "")

    result = analyze_dna_sequence(sequence)

    return result