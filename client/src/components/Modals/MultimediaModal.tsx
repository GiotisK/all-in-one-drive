import { useSelector } from 'react-redux';
import { BaseModal } from './BaseModal';
import { styled } from 'styled-components';
import { RootState } from '../../redux/types';

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

export const MultimediaModal = (): JSX.Element => {
	const { visible, multimediaType } = useSelector(
		(state: RootState) => state.modal.multimediaModal
	);

	return (
		<BaseModal visible={visible} showHeader={false}>
			<>
				{multimediaType === 'audio' && (
					<SoundContent>
						<audio
							controls={true}
							/* src={props.openFileLink.src}
							type={mimeTypes[props.openFileLink.extension]} */
						/>
					</SoundContent>
				)}
				{multimediaType === 'video' && (
					<Video
						controls={true}
						/* 	src={props.openFileLink.src}
						type={mimeTypes[props.openFileLink.extension]} */
					/>
				)}
				{multimediaType === 'image' && (
					<Image
					/* src={props.openFileLink.src} */
					/>
				)}
			</>
		</BaseModal>
	);
};
