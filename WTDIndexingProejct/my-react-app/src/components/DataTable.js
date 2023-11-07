import React from "react";

// Make sure to accept the props parameter
const DataTable = ({ data }) => {
	// Use the data prop to render your table
	return (
		<table>
			<thead>
				<tr>
					<th>Modern Name</th>
					<th>Alternative Name</th>
					<th>State/Province/Country</th>
				</tr>
			</thead>
			<tbody>
				{data.map((item, index) => (
					<tr key={index}>
						<td>{item["Modern Name"] || "N/A"}</td>
						<td>{item["Alternative Name"] || "N/A"}</td>
						<td>{item["State/Province/Country"] || "N/A"}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default DataTable;
