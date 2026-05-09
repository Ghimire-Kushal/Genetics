def generate_insights(analysis_data):

    mutation_columns = analysis_data.get(
        "detected_mutation_columns", []
    )

    total_rows = analysis_data.get("total_rows", 0)

    insights = []

    if len(mutation_columns) > 0:
        insights.append(
            f"Detected mutation-related genomic columns: {', '.join(mutation_columns)}"
        )

    if total_rows > 1000:
        insights.append(
            "Large genomic dataset detected. Advanced AI analysis recommended."
        )
    else:
        insights.append(
            "Dataset size is manageable for rapid genomic processing."
        )

    if "gene" in mutation_columns:
        insights.append(
            "Gene mutation patterns identified for further clinical interpretation."
        )

    if "mutation" in mutation_columns:
        insights.append(
            "Mutation markers detected. Potential genomic abnormalities may exist."
        )

    if len(insights) == 0:
        insights.append(
            "No significant genomic mutation indicators detected."
        )

    return {
        "status": "success",
        "insights": insights
    }