import pandas as pd
from django.test import TestCase
from django.urls import reverse
from .views import fetch_csv_data, search_data


class CSVAppTests(TestCase):

    def test_fetch_csv_data(self):
        data = fetch_csv_data()
        # Check if the data is a DataFrame.
        self.assertIsInstance(data, pd.DataFrame)
        # Check if the DataFrame is not empty.
        self.assertNotEqual(data.shape[0], 0)

    def test_search_data(self):
        # Construct the URL with a query parameter.
        response = self.client.get(reverse('search_data'), {
                                   'search': 'some_search_term'})

        # Check if the status code is 200 (OK).
        self.assertEqual(response.status_code, 200)

        # Check if the response is JSON (you can add more checks as needed).
        self.assertIsInstance(response.json(), list)
