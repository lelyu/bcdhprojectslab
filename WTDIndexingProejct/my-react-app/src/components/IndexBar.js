import React from "react";

const IndexBar = ({ onIndex }) => {
	const handleIndexSelect = (index) => {
		onIndex(index);
	};
	// alphabetically ordered list of indices
	const indices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
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
