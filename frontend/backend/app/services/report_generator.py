def generate_report(data):
    report = f"""
GENESCOPE AI REPORT
===================

Filename: {data.get('filename')}

Dataset Summary:
{data.get('dataset_summary')}

AI Insights:
{data.get('ai_insights')}
"""

    return report