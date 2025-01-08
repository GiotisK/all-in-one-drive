import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DriveEntity, FileEntity } from '../../shared/types/global.types';

export const driveApi = createApi({
	reducerPath: 'driveApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/drives', credentials: 'include' }),
	endpoints: builder => ({
		getDriveRootFiles: builder.query<FileEntity[], void>({
			query: () => ({ url: '/files' }),
			providesTags: ['Drives'],
		}),
		getDriveFolderFiles: builder.query<FileEntity[], { driveId?: string; folderId?: string }>({
			query: ({ driveId, folderId }) => ({
				url: `${driveId}/folders/${folderId}/files`,
			}),
			providesTags: ['Drives'],
		}),
		getDrives: builder.query<DriveEntity[], void>({
			query: () => ({ url: '' }),
			providesTags: ['Drives'],
		}),
		deleteDrive: builder.mutation<void, { driveId: string }>({
			query: ({ driveId }) => ({ url: `/${driveId}`, method: 'DELETE' }),
			invalidatesTags: ['Drives'],
		}),
	}),
	tagTypes: ['Drives'],
});

export const {
	useGetDriveRootFilesQuery,
	useGetDriveFolderFilesQuery,
	useGetDrivesQuery,
	useLazyGetDrivesQuery,
	useDeleteDriveMutation,
} = driveApi;
