import type { WindowSize } from "@/app/types/client-types";

export default function getWindowSize(): WindowSize {

  const { innerWidth, innerHeight } = window;

  return {
    width: innerWidth,
    height: innerHeight
  }

}