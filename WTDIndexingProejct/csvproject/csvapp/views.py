from django.http import JsonResponse
import pandas as pd
import requests
import io

CSV_URL = "https://raw.githubusercontent.com/brlehman/bcdhprojectslab/main/WTDIndexingProejct/TDnameIndex.csv"


# get data from the CSV URL and return it as a DataFrame but filter out some columns
# from modernName,alternativeNames,state,country,latitude,longitude,ID,Type,AltID, only keep modernName,alternativeNames,AltScript,state,country
def fetch_csv_data():
    csv_data = requests.get(CSV_URL).content
    data = pd.read_csv(io.StringIO(csv_data.decode('utf-8')))
    data = data[["modernName", "alternativeNames",
                 "state", "country"]]

    return data


# get the data for a specific starting letter (A-Z) by the column "modernName"
# used for the "Browse by Letter" feature, or like a indexing
def get_indexed_data(request, letter):
    data = fetch_csv_data()
    filtered_data = data[data["Modern Name"].str.startswith(letter)]
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


# search the data for a specific search term
def search_data(request):
    search_term = request.GET.get('search', '')
    data = fetch_csv_data()
    # Searching across all columns
    filtered_data = data[data.apply(lambda row: row.astype(
        str).str.contains(search_term).any(), axis=1)]
    results = []
    for _, row in filtered_data.iterrows():
        result = {
            "Modern Name": row["modernName"],
            "Alt Name": row['alternativeNames'],
            "AltScript": row["AltScript"],
            "State/Province/Country": f"{row['State']}, {row['Province']}, {row['Country']}",
        }
        results.append(result)
    return JsonResponse(results, safe=False)


# return all filtered data as JSON
# call fetch_csv_data() to get all data and convert it to JSON
def get_all_data(request):
    data = fetch_csv_data()
    results = []
    for _, row in data.iterrows():
        result = {
            "Modern Name": row["modernName"],
            "Alternitive Name": row['alternativeNames'],
            "State/Province/Country": f"{row['state']}, {row['country']}",
        }
        results.append(result)
    return JsonResponse(results, safe=False)


def homePageView(request):
    return JsonResponse({"message": "Hello, world!"})
