// export const logoutUser = createAsyncThunk<void, undefined, { state: RootState }>(
// 	'user/logout',
// 	async (_, { dispatch, getState }) => {
// 		const { drives } = getState().drives;

// 		await Promise.all(
// 			drives.map(async ({ id: driveId, watchChangesChannel }) => {
// 				if (!watchChangesChannel) {
// 					return;
// 				}
// 				//TODO: improve "id" var name to something more descriptive
// 				const { id, resourceId } = watchChangesChannel;
// 				await dispatch(unsubscribeForChanges({ driveId, id, resourceId }));
// 			})
// 		);

// 		await UserService.logoutUser();
// 	}
// );
