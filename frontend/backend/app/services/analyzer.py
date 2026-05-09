import pandas as pd


def analyze_genomic_data(file_path):

    try:
        # Read CSV
        df = pd.read_csv(file_path)

        # Basic dataset info
        total_rows = len(df)
        total_columns = len(df.columns)

        # Column names
        columns = list(df.columns)

        # Simple mutation detection
        mutation_columns = []

        for column in columns:
            column_name = column.lower()

            if "mutation" in column_name or "gene" in column_name:
                mutation_columns.append(column)

        return {
            "status": "success",
            "total_rows": total_rows,
            "total_columns": total_columns,
            "columns": columns,
            "detected_mutation_columns": mutation_columns
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }