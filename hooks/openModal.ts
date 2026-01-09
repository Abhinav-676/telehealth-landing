import { setTrue } from "@/store/slices/modelVisibility";
import { useDispatch } from "react-redux";

export function useOpenModal() {
  const dispatch = useDispatch();
  return () => dispatch(setTrue());
}