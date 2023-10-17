from django.http import JsonResponse
import pandas as pd
import requests
import io

CSV_URL = "https://raw.githubusercontent.com/brlehman/bcdhprojectslab/main/WTD_Indexing/TDnameIndex.csv"


def fetch_csv_data():
    resp = requests.get(CSV_URL)
    resp.raise_for_status()
    data = pd.read_csv(io.BytesIO(resp.content))
    return data


def get_indexed_data(request, letter):
    data = fetch_csv_data()
    print("Original Data:")
    print(data.head())  # Print first few rows for clarity.

    # Filter out NaN values in 'Modern Name' column first.
    data = data[data['Modern Name'].notna()]

    # Perform a case-insensitive match.
    filtered_data = data[data['Modern Name'].str.lower(
    ).str.startswith(letter.lower())]

    print(f"\nFiltered Data for letter '{letter}':")
    print(filtered_data)

    results = []
    for _, row in filtered_data.iterrows():
        alt_name = f"{row['AltName1']}, {row['AltName2']}"
        result = {
            "Modern Name": row["Modern Name"],
            "Alt Name": alt_name if 'nan' not in alt_name.lower() else "",
            "AltScript": row["AltScript"] if pd.notna(row["AltScript"]) else "",
            "State/Province/Country": row["State/Province/Country"] if pd.notna(row["State/Province/Country"]) else "",
        }
        results.append(result)

    return JsonResponse(results, safe=False)


def search_data(request):
    search_term = request.GET.get('search', '')
    data = fetch_csv_data()
    # Searching across all columns
    filtered_data = data[data.apply(lambda row: row.astype(
        str).str.contains(search_term).any(), axis=1)]
    results = []
    for _, row in filtered_data.iterrows():
        result = {
            "Modern Name": row["Modern Name"],
            "Alt Name": f"{row['AltName1']}, {row['AltName2']}",
            "AltScript": row["AltScript"],
            "State/Province/Country": row["State/Province/Country"],
        }
        results.append(result)
    return JsonResponse(results, safe=False)


def get_all_data(request):
    data = fetch_csv_data()

    # Handle NaN values for the AltNames and concatenate them
    data['Alt Name'] = data['AltName1'].fillna(
        '') + ', ' + data['AltName2'].fillna('')
    # Remove any trailing or leading commas that result from NaN values
    data['Alt Name'] = data['Alt Name'].str.strip(', ')

    # Construct the results list without latitude and longitude
    results = data[['Modern Name', 'Alt Name', 'AltScript',
                    'State/Province/Country']].to_dict(orient='records')

    return JsonResponse(results, safe=False)
