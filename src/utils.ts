import { promises as fs } from 'fs';

export const getFileStats = async (path: string) => (await fs.stat(path).catch(e => null));