import React from "react";

const IndexBar = ({ onIndex }) => {
	const handleIndexSelect = (index) => {
		onIndex(index);
	};

	// Assuming you have a predefined set of indices
	const indices = ["A", "B", "C", "D"]; // etc.

	return (
		<div>
			{indices.map((index) => (
				<button key={index} onClick={() => handleIndexSelect(index)}>
					{index}
				</button>
			))}
		</div>
	);
};

export default IndexBar;
