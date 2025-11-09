import { Buffer } from "buffer";
(globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;
(window as any).Buffer = (window as any).Buffer || Buffer;
(globalThis as any).global = (globalThis as any).global || globalThis;
