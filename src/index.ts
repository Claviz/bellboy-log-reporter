import getAppDataPath from 'appdata-path';
import { IBellboyEvent, Job, Reporter } from 'bellboy';
import { promises as fs } from 'fs';
import { join } from 'path';

import { IReporterConfig } from './types';
import { getFileStats } from './utils';

const fstorm = require('fstorm');

function appendToFile(writer: any, bellboyEvent: IBellboyEvent) {
    return new Promise((resolve, reject) => {
        writer.write(`${JSON.stringify(bellboyEvent)}\n`, { flag: 'a' }, (err: any, status: 0 | 1) => {
            if (status === 1) {
                resolve();
            }
        });
    });
}

class LogReporter extends Reporter {

    #path: string;

    constructor(config?: IReporterConfig) {
        super();
        this.#path = config?.path || '';
    }

    async report(job: Job) {
        if (!this.#path) {
            const path = join(getAppDataPath(), 'bellboy-logs');
            const pathExists = await getFileStats(path);
            if (!pathExists) {
                await fs.mkdir(path);
            }
            this.#path = path;
        }
        const writer = fstorm(join(this.#path, `${Date.now()}.log`));
        job.onAny(undefined, async (event) => {
            await appendToFile(writer, event);
        });
    }

}

export = LogReporter;