import "./App.css";
import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Theme } from "./providers/Theme";
import { ThemeMode } from "./Shared/types/types";
import { ErrorPage } from "./pages/ErrorPage";

function App() {
	const [themeMode] = useState<ThemeMode>("light"); //TODO: this should be move in redux store (?)

	return (
		<Theme mode={themeMode}>
			<ErrorPage errorType="unauthorized" />
		</Theme>
	);
}

export default App;
