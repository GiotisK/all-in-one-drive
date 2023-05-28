import { useState } from "react";
import { Checkbox } from "../components/Checkbox";

export const DrivePage = (): JSX.Element => {
	const [kek, setkek] = useState(false);
	return (
		<Checkbox
			checked={kek}
			onChange={() => {
				setkek(!kek);
			}}
		/>
	);
};
