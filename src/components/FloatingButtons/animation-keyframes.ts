import { keyframes } from "styled-components";
import { Keyframes } from "styled-components/dist/types";

export const slideUp40pxAnimation: Keyframes = keyframes`
	from {
		transform: translateY(40px);
		opacity: 0.2;
	}
	to {
		transform: translateY(0px);
		opacity: 1;
	}
`;

export const slideUp70pxAnimation: Keyframes = keyframes`
	from {
		transform: translateY(70px);
		opacity: 0.2;
	}
	to {
		transform: translateY(0px);
		opacity: 1;
	}
`;

export const rotate45deg: Keyframes = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(45deg);
	}
`;

export const rotate45degBackwards: Keyframes = keyframes`
	from {
		transform: rotate(45deg);
	}
	to {
		transform: rotate(0deg);
	}
`;
