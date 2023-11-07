import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		onSearch(searchTerm);
	};

	return (
		<form onSubmit={handleSearchSubmit}>
			<input
				type="text"
				value={searchTerm}
				onChange={handleSearchChange}
				placeholder="Search..."
			/>
			<button type="submit">Search</button>
		</form>
	);
};

export default SearchBar;
