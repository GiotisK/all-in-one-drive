import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store/types';
import { SvgNames, createSvg } from '../../shared/utils/svg-utils';
import { Toggle } from './Toggle';
import { toggleTheme } from '../../redux/slices/settings/settingsSlice';
import { styled } from 'styled-components';

const SvgContainer = styled.div`
	display: flex;
	height: 100%;
	justify-content: space-evenly;
	align-items: center;
	border-radius: inherit;
`;

export const ThemeToggle = () => {
	const dispatch = useDispatch();
	const themeMode = useSelector((state: RootState) => state.settings.themeMode);

	const handleThemeChange = () => {
		saveThemeToLocalStorage();
		dispatch(toggleTheme());
	};

	const saveThemeToLocalStorage = () => {
		const nextThemeMode = themeMode === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', nextThemeMode);
	};

	return (
		<Toggle checked={themeMode === 'dark'} onChange={handleThemeChange}>
			<SvgContainer>
				{createSvg(SvgNames.Moon, 12, 'white')}
				{createSvg(SvgNames.Sun, 13, 'black')}
			</SvgContainer>
		</Toggle>
	);
};
