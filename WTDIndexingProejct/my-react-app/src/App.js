import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import SearchBar from "./SearchBar";
import IndexBar from "./IndexBar";

function App() {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await fetch("/api/data");
			const json = await response.json();
			setData(json);
			setFilteredData(json); // Initially, filteredData is the same as the full dataset
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const handleSearch = async (searchQuery) => {
		// Assuming your API can handle the search query
		const response = await fetch(`/api/data?search=${searchQuery}`);
		const json = await response.json();
		setFilteredData(json); // Update the data with the search results
	};

	const handleIndex = async (index) => {
		// Assuming your API can handle indexing
		const response = await fetch(`/api/data?index=${index}`);
		const json = await response.json();
		setFilteredData(json); // Update the data with the indexed results
	};

	return (
		<div>
			<SearchBar onSearch={handleSearch} />
			<IndexBar onIndex={handleIndex} />
			<DataTable data={filteredData} />
		</div>
	);
}

export default App;
