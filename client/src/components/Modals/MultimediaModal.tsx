import { MultimediaModalState } from '../../redux/slices/modal/types';
import { BaseModal } from './BaseModal';
import { styled } from 'styled-components';

const SoundContent = styled.div`
	display: flex;
	z-index: 2;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: max-content;
	height: 100px;
	border-radius: 5px;
`;

const Video = styled.video`
	z-index: 3;
	max-width: 900px;
	max-height: 800px;
`;

const Image = styled.img`
	max-width: 900px;
	max-height: 800px;
`;

interface IProps {
	state: MultimediaModalState;
}

export const MultimediaModal = ({ state }: IProps): JSX.Element => {
	const { multiMediaType } = state;

	return (
		<BaseModal>
			{multiMediaType === 'audio' && (
				<SoundContent>
					<audio
						controls
						/* src={props.openFileLink.src}
							type={mimeTypes[props.openFileLink.extension]} */
					/>
				</SoundContent>
			)}
			{multiMediaType === 'video' && (
				<Video
					controls
					/* 	src={props.openFileLink.src}
						type={mimeTypes[props.openFileLink.extension]} */
				/>
			)}
			{multiMediaType === 'image' && (
				<Image
				/* src={props.openFileLink.src} */
				/>
			)}
		</BaseModal>
	);
};
