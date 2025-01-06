import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FileEntity } from '../../shared/types/global.types';

export const driveApi = createApi({
	reducerPath: 'driveApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/drives', credentials: 'include' }),
	endpoints: builder => ({
		getDriveRootFiles: builder.query<FileEntity[], void>({
			query: () => ({ url: '/files' }),
		}),
		getDriveFolderFiles: builder.query<FileEntity[], { driveId?: string; folderId?: string }>({
			query: ({ driveId, folderId }) => ({
				url: `${driveId}/folders/${folderId}/files`,
			}),
		}),
	}),
});

export const {
	useGetDriveRootFilesQuery,
	useGetDriveFolderFilesQuery,
	useLazyGetDriveFolderFilesQuery,
} = driveApi;
