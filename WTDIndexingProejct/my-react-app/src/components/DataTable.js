import React from "react";

function DataTable({ data }) {
	return (
		<table>
			<thead>
				<tr>
					<th>Modern Name</th>
					<th>Alt Names</th>
					{/* Add other headers as needed */}
				</tr>
			</thead>
			<tbody>
				{data.map((row, index) => (
					<tr key={index}>
						<td>{row["Modern Name"]}</td>
						<td>
							{row["AltName1"]} {row["AltName2"]}
						</td>
						{/* Render other columns as needed */}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default DataTable;
