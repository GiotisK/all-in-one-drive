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
	},
};

const darkTheme: DefaultTheme = {
	colors: {
		bluePrimary: "blue",
		blueSecondary: "#9ad1f3",
		textPrimary: "#363636",
	},
};

export const Theme = ({ children, mode }: PropsWithChildren<ThemeProps>) => {
	const theme = mode === "light" ? lightTheme : darkTheme;

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
