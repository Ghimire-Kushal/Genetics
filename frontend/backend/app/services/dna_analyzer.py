from collections import Counter


def analyze_dna_sequence(sequence: str):

    sequence = sequence.upper().replace(" ", "")

    if not sequence:
        return {
            "status": "error",
            "message": "DNA sequence cannot be empty"
        }

    valid_nucleotides = ["A", "T", "C", "G"]

    invalid_chars = [
        char for char in sequence
        if char not in valid_nucleotides
    ]

    if invalid_chars:
        return {
            "status": "error",
            "message": "Invalid DNA sequence"
        }

    nucleotide_counts = Counter(sequence)

    gc_content = (
        (
            nucleotide_counts.get("G", 0)
            + nucleotide_counts.get("C", 0)
        ) / len(sequence)
    ) * 100

    return {
        "status": "success",
        "sequence_length": len(sequence),
        "gc_content": round(gc_content, 2),
        "nucleotide_counts": dict(nucleotide_counts)
    }