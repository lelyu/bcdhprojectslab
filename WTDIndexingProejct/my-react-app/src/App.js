import React, { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import SearchBar from "./components/SearchBar";
import IndexBar from "./components/IndexBar";

function App() {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("http://127.0.0.1:8000/data");
			if (!response.ok) throw new Error("Network response was not ok.");
			const json = await response.json();
			setData(json);
			setFilteredData(json);
		} catch (error) {
			console.error("Error fetching data: ", error);
			setError(error.toString());
		}
		setIsLoading(false);
	};

	const handleSearch = async (searchQuery) => {
		try {
			const response = await fetch(
				`http://127.0.0.1:8000/search?query=${searchQuery}`
			);
			if (!response.ok) throw new Error("Network response was not ok.");
			const json = await response.json();
			setFilteredData(json);
		} catch (error) {
			console.error("Error in search: ", error);
		}
	};

	const handleIndex = async (index) => {
		try {
			const response = await fetch(
				`http://127.0.0.1:8000/data?index=${index}`
			);
			if (!response.ok) throw new Error("Network response was not ok.");
			const json = await response.json();
			setFilteredData(json);
		} catch (error) {
			console.error("Error in indexing: ", error);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<SearchBar onSearch={handleSearch} />
			<IndexBar onIndex={handleIndex} />
			<DataTable data={filteredData} />
		</div>
	);
}

export default App;
