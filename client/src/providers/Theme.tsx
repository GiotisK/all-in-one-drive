import { PropsWithChildren } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { useAppSelector } from '../redux/store/store';

const lightTheme: DefaultTheme = {
	colors: {
		bluePrimary: '#24a0ed',
		blueSecondary: '#9ad1f3',
		textPrimary: '#363636',
		textSecondary: 'gray',
		green: '#82d882',
		gray: '#C9C9C9',
		red: 'red',
		orange: 'orange',
		background: 'white',
		backgroundSecondary: 'white',
		border: 'lightgray',
		boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
		panelBackground: '#f0f0f0',
		panelSvg: 'gray',
	},
};

const darkTheme: DefaultTheme = {
	colors: {
		bluePrimary: '#1976a8',
		blueSecondary: '#377aae',
		textPrimary: 'white',
		textSecondary: 'dimgray',
		green: '#82d882',
		gray: '#333333',
		red: '#dc143c',
		orange: '#e9692c',
		background: '#18191A',
		backgroundSecondary: '#3E4042',
		border: '#555555',
		boxShadow: '0 -2px 10px rgba(0, 0, 0, 1);',
		panelBackground: '#222222',
		panelSvg: 'white',
	},
};

export const Theme = ({ children }: PropsWithChildren): JSX.Element => {
	const themeMode = useAppSelector(state => state.settings.themeMode);
	const theme = themeMode === 'light' ? lightTheme : darkTheme;

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
