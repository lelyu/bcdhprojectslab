import React from "react";

function IndexBar({ onSelectIndex }) {
	const indices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	return (
		<div>
			{indices.map((index) => (
				<button key={index} onClick={() => onSelectIndex(index)}>
					{index}
				</button>
			))}
		</div>
	);
}

export default IndexBar;
