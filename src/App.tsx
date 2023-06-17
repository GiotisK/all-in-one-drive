import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Theme } from './providers/Theme';
import { ThemeMode } from './shared/types/types';
import { ErrorPage } from './pages/ErrorPage';
import { TitleBanner } from './components/TitleBanner';
import { DrivePage } from './pages/DrivePage';
import { Provider } from 'react-redux';
import store from './redux/store/store';

function App() {
	return (
		<Provider store={store}>
			<Theme>
				<DrivePage />
			</Theme>
		</Provider>
	);
}

export default App;
