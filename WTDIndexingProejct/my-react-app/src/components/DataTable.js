import React from "react";
import "./DataTable.css";
const DataTable = ({ data }) => {
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
						{/* Use "N/A" for missing or NaN values */}
						<td>{item["Modern Name"] ?? "N/A"}</td>
						{/* Correcting for the typo in the JSON key */}
						<td>
							{item["Alternative Name"] ??
								item["Alternitive Name"] ??
								"N/A"}
						</td>
						<td>{item["State/Province/Country"] ?? "N/A"}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default DataTable;
