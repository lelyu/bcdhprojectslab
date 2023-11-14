import React from "react";

const IndexBar = ({ onIndex }) => {
	const handleIndexSelect = (index) => {
		onIndex(index);
	};

	const indices = ["A", "B", "C", "D", "E"]; // etc.

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
