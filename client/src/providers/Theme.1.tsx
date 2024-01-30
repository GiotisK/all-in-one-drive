import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './Theme';

export const Theme = ({ children }: PropsWithChildren): JSX.Element => {
	const themeMode = useAppSelector((state: RootState) => state.settings.themeMode);
	const theme = themeMode === 'light' ? lightTheme : darkTheme;

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
