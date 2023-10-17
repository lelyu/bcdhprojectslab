import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import IndexBar from "./components/IndexBar";
import DataTable from "./components/DataTable";

function App() {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		// Fetch data from your Django backend
		fetch("/http://localhost:8000/data/A/")
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				setFilteredData(data);
			});
	}, []);

	const handleSearch = (searchTerm) => {
		fetch(`http://localhost:8000/search/?search=${searchTerm}`)
			.then((response) => response.json())
			.then((filtered) => {
				setFilteredData(filtered);
			})
			.catch((error) => {
				console.error("Error fetching search data:", error);
			});
	};

	const handleIndexSelect = (index) => {
		fetch(`http://localhost:8000/data/${index}/`)
			.then((response) => response.json())
			.then((filtered) => {
				setFilteredData(filtered);
			})
			.catch((error) => {
				console.error("Error fetching indexed data:", error);
			});
	};

	return (
		<div>
			<SearchBar onSearch={handleSearch} />
			<IndexBar onSelectIndex={handleIndexSelect} />
			<DataTable data={filteredData} />
		</div>
	);
}

export default App;
