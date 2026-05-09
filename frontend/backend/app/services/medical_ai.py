import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def build_local_medical_summary(dataset_summary):
    mutation_columns = dataset_summary.get("detected_mutation_columns", [])
    total_rows = dataset_summary.get("total_rows", 0)
    total_columns = dataset_summary.get("total_columns", 0)

    if mutation_columns:
        risk_line = (
            f"Detected {len(mutation_columns)} mutation-related field(s): "
            f"{', '.join(mutation_columns)}."
        )
        action_line = "Review these variant signals with a genetics specialist before clinical use."
    else:
        risk_line = "No mutation-specific fields were detected in this upload."
        action_line = "Add gene, mutation, or variant annotations for stronger interpretation."

    return {
        "recommendation": "\n".join([
            f"Dataset reviewed with {total_rows} row(s) and {total_columns} column(s).",
            risk_line,
            action_line,
            "Use this as decision support only, not a standalone diagnosis."
        ])
    }


def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    return OpenAI(api_key=api_key, timeout=10)


def generate_medical_insights(dataset_summary):
    client = get_client()
    if client is None:
        return build_local_medical_summary(dataset_summary)

    prompt = f"""
    You are a genomic medical AI assistant.

    Analyze this genomic dataset summary and provide a concise medical summary.
    Return only 3 to 4 short lines. Do not add headings or bullet markers.

    Dataset:
    {dataset_summary}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )
    except Exception:
        return build_local_medical_summary(dataset_summary)

    return response.choices[0].message.content
