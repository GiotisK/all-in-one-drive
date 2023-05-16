import { FaBeer } from "react-icons/fa";
import "./ErrorText.css";

export const ErrorText = (props: any) => {
	return (
		<div className="error-text-container">
			<FaBeer />

			<p className="login-error-text" style={{ color: props.textColor }}>
				{props.errorText}
			</p>
		</div>
	);
};
