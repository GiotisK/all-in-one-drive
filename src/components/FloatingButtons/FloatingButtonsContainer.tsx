import { useState, useRef } from "react";
import styled from "styled-components";
import FloatingButton from "./FloatingButton";
import { SvgNames } from "../../Shared/utils/svg-utils";

const Container = styled.div`
	position: absolute;
	bottom: 5%;
	right: 5%;
`;

export const FloatingButtonsContainer = (): JSX.Element => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [plusButtonClass, setPlusButtonClass] = useState("");

	const uploaderRef = useRef<HTMLInputElement | null>(null);

	const openFloatingMenu = (): void => {
		setPlusButtonClass(menuOpen ? "reset-rotate-45-deg" : "rotate-45");
		setMenuOpen((prevMenuOpen) => !prevMenuOpen);
	};

	const openFilePicker = (): void => {
		uploaderRef.current?.click();
	};

	const uploadFile = (): void => {
		//TODO: upload file here
		console.log("upload file");
	};

	return (
		<Container>
			{menuOpen && (
				<>
					<FloatingButton
						color="orange"
						classes={"slide-up-70px"}
						icon={SvgNames.AddFile}
						onClick={openFilePicker}
					>
						<input
							type="file"
							id="file"
							ref={uploaderRef}
							style={{ display: "none" }}
							onChange={uploadFile}
						/>
					</FloatingButton>
					<FloatingButton
						icon={SvgNames.AddFolder}
						color="red"
						classes={"slide-up-40px"}
					/>
				</>
			)}

			<FloatingButton
				icon={SvgNames.Plus}
				color="#24a0ed"
				onClick={openFloatingMenu}
				classes={plusButtonClass}
			/>
		</Container>
	);
};
