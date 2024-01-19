import { useState, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import FloatingButton from './FloatingButton';
import { SvgNames } from '../../shared/utils/svg-utils';
import { Keyframes } from 'styled-components/dist/types';
import {
	rotate45deg,
	rotate45degBackwards,
	slideUp40pxAnimation,
	slideUp70pxAnimation,
} from './animation-keyframes';
import { Nullable } from '../../shared/types/global.types';

const Container = styled.div`
	position: absolute;
	bottom: 5%;
	right: 5%;
`;

const FileOpenerInput = styled.input`
	display: none;
`;

export const FloatingButtonsContainer = (): JSX.Element => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [plusButtonAnimation, setPlusButtonAnimation] = useState<Keyframes>();
	const theme = useTheme();

	const uploaderRef = useRef<Nullable<HTMLInputElement>>(null);

	const openFloatingMenu = (): void => {
		setPlusButtonAnimation(menuOpen ? rotate45degBackwards : rotate45deg);
		setMenuOpen(prevMenuOpen => !prevMenuOpen);
	};

	const openFilePicker = (): void => {
		uploaderRef.current?.click();
	};

	const uploadFile = (): void => {
		//TODO: upload file here
		console.log('upload file');
	};

	return (
		<Container>
			{menuOpen && (
				<>
					<FloatingButton
						color={theme?.colors.orange ?? 'orange'}
						icon={SvgNames.AddFile}
						onClick={openFilePicker}
						animation={slideUp70pxAnimation}
					>
						<FileOpenerInput
							type='file'
							id='file'
							ref={uploaderRef}
							onChange={uploadFile}
						/>
					</FloatingButton>
					<FloatingButton
						icon={SvgNames.AddFolder}
						color={theme?.colors.red ?? 'red'}
						animation={slideUp40pxAnimation}
					/>
				</>
			)}

			<FloatingButton
				icon={SvgNames.Plus}
				color={`${theme?.colors.bluePrimary}`}
				onClick={openFloatingMenu}
				animation={plusButtonAnimation}
			/>
		</Container>
	);
};
