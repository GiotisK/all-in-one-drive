import { PropsWithChildren } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";

const lightTheme: DefaultTheme = {
	colors: {
		bluePrimary: "#24a0ed",
		blueSecondary: "#9ad1f3",
		textPrimary: "#363636",
		textSecondary: "gray",
		green: "#82d882",
		red: "red",
		orange: "orange",
		background: "white",
		backgroundSecondary: "white",
		border: "lightgray",
		boxShadow:
			"0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
		panel: "#f0f0f0",
	},
};

const darkTheme: DefaultTheme = {
	colors: {
		bluePrimary: "#1976a8",
		blueSecondary: "#377aae",
		textPrimary: "white",
		textSecondary: "dimgray",
		green: "#82d882",
		red: "#CC4E5C",
		orange: "#8B0000",
		background: "#18191A",
		backgroundSecondary: "#3E4042",
		border: "#555555",
		boxShadow: "0 -2px 10px rgba(0, 0, 0, 1);",
		panel: "#222222",
	},
};

export const Theme = ({ children }: PropsWithChildren): JSX.Element => {
	const themeMode = useSelector(
		(state: RootState) => state.settings.themeMode
	);
	const theme = themeMode === "light" ? lightTheme : darkTheme;

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
