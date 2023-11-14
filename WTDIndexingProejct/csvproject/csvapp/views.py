from django.shortcuts import render
from django.http import JsonResponse
import pandas as pd
import requests
import io
from fuzzywuzzy import fuzz
from django.core.cache import cache

CSV_URL = "https://raw.githubusercontent.com/brlehman/bcdhprojectslab/main/WTDIndexingProejct/TDnameIndex.csv"

def load_data_into_memory():
    csv_data = requests.get(CSV_URL).content
    data = pd.read_csv(io.StringIO(csv_data.decode('utf-8')))
    data = data[["modernName", "alternativeNames", "state", "country"]]
    data = data.where(pd.notnull(data), None)
    cache.set('csv_data', data, timeout=None)  # Adjust timeout as needed

def get_csv_data():
    data = cache.get('csv_data')
    if data is None:
        load_data_into_memory()
        data = cache.get('csv_data')
    return data

def create_result_dict(row):
    return {
        "Modern Name": row["modernName"],
        "Alternative Name": row["alternativeNames"],
        "State/Province/Country": f"{row['state']}, {row['country']}"
    }

def get_indexed_data(request, letter):
    data = get_csv_data()
    letter = letter.upper()
    filtered_data = data[data['modernName'].str.startswith(letter, na=False)]
    results = [create_result_dict(row) for _, row in filtered_data.iterrows()]
    return JsonResponse(results, safe=False)

def search_data(request, term):
    data = get_csv_data()
    term = term.lower()
    results = []
    for _, row in data.iterrows():
        if any(fuzz.ratio(term, str(value).lower()) > 75 for value in row.values):
            results.append(create_result_dict(row))
    return JsonResponse(results, safe=False)

def get_all_data(request):
    data = get_csv_data()
    results = [create_result_dict(row) for _, row in data.iterrows()]
    return JsonResponse(results, safe=False)

def homePageView(request):
    return JsonResponse({"message": "Hello, world!"})

def handler404(request, exception):
    return render(request, '404.html', status=404)
