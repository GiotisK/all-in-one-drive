import { PropsWithChildren } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { ThemeMode } from "../Shared/types/types";

interface ThemeProps {
	mode: ThemeMode;
}

const lightTheme: DefaultTheme = {
	colors: {
		bluePrimary: "#24a0ed",
	},
};

const darkTheme: DefaultTheme = {
	colors: {
		bluePrimary: "blue",
	},
};

export const Theme = ({ children, mode }: PropsWithChildren<ThemeProps>) => {
	const theme = mode === "light" ? lightTheme : darkTheme;

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
