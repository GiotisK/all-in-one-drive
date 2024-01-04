import { AddDriveModal } from './AddDriveModal';
import { DeleteModal } from './DeleteModal';
import { ExportFormatModal } from './ExportFormatModal';
import { MultimediaModal } from './MultimediaModal';
import { RenameModal } from './RenameModal';
import { UploadModal } from './UploadModal';

export const ModalContainer = (): JSX.Element => {
	return (
		<>
			<AddDriveModal />
			<DeleteModal />
			<ExportFormatModal />
			<MultimediaModal />
			<RenameModal />
			<UploadModal />
		</>
	);
};
