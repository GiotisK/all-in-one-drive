import "./App.css";
import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Theme } from "./providers/Theme";
import { ThemeMode } from "./Shared/types/types";
import { ErrorPage } from "./pages/ErrorPage";
import { TitleBanner } from "./components/TitleBanner";

function App() {
	const [themeMode] = useState<ThemeMode>("light"); //TODO: this should be move in redux store (?)

	return (
		<Theme mode={themeMode}>
			<LandingPage />
			<TitleBanner virtualDriveEnabled={false} popupMenu={false} />
		</Theme>
	);
}

export default App;
