import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Theme } from './providers/Theme';
import { ErrorPage } from './pages/ErrorPage';
import { DrivePage } from './pages/DrivePage';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { HomePage } from './pages/HomePage';
import { routes } from './shared/constants/routes';
import { ThemedToastContainer } from './components/ThemedToastContainer';
import { PendingFilesProvider } from './providers/PendingFilesProvider';

const router = createBrowserRouter([
	{
		path: routes.home,
		element: <HomePage />,
	},
	{
		path: routes.login,
		element: <LandingPage />,
	},
	{
		path: routes.drive,
		element: <DrivePage />,
		children: [
			{
				path: ':driveId/:folderId',
				element: <DrivePage />,
			},
		],
	},
	{
		path: '*',
		element: <ErrorPage />,
	},
]);

function App() {
	return (
		<Provider store={store}>
			<PendingFilesProvider>
				<Theme>
					<ThemedToastContainer />
					<RouterProvider router={router} />
				</Theme>
			</PendingFilesProvider>
		</Provider>
	);
}

export default App;
