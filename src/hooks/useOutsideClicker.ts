import { useEffect, RefObject } from "react";

export const useOutsideClicker = <T extends HTMLElement>(
	ref: RefObject<T>,
	triggerRef: RefObject<T>,
	cb: () => void
): void => {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				ref.current &&
				!ref.current.contains(event.target as Node) &&
				!triggerRef.current?.contains(event.target as Node)
			) {
				cb();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, cb, triggerRef]);
};
