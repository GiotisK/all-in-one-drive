import "./App.css";
import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Theme } from "./providers/Theme";
import { ThemeMode } from "./Shared/types/types";

function App() {
	const [themeMode] = useState<ThemeMode>("light"); //TODO: this should be move in redux store (?)

	return (
		<Theme mode={themeMode}>
			<LandingPage />
		</Theme>
	);
}

export default App;
