import { PropsWithChildren } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { ThemeMode } from "../Shared/types/types";

interface ThemeProps {
	mode: ThemeMode;
}

const lightTheme: DefaultTheme = {
	colors: {
		bluePrimary: "#24a0ed",
		blueSecondary: "#9ad1f3",
		textPrimary: "#363636",
		textSecondary: "gray",
	},
};

const darkTheme: DefaultTheme = {
	colors: {
		bluePrimary: "blue",
		blueSecondary: "#9ad1f3",
		textPrimary: "#363636",
		textSecondary: "gray",
	},
};

export const Theme = ({
	children,
	mode,
}: PropsWithChildren<ThemeProps>): JSX.Element => {
	const theme = mode === "light" ? lightTheme : darkTheme;

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
