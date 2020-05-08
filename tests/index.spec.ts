import getAppDataPath from 'appdata-path';
import { Destination, DynamicProcessor, IBellboyEvent, Job } from 'bellboy';
import { promises as fs } from 'fs';
import { join } from 'path';

import LogReporter from '../src';
import { getFileStats } from '../src/utils';

beforeAll(async () => {
});

beforeEach(async () => {
});

afterAll(async () => {
});

async function getLogFileContent(folderPath: string): Promise<string> {
    const files = await fs.readdir(folderPath);
    const logFileName = files.find(x => x.includes('.log'));
    const logFileContent = await fs.readFile(join(folderPath, logFileName!), { encoding: 'utf8' });

    return logFileContent;
}

afterEach(async () => {
    const files = await fs.readdir('./');
    const logFiles = files.filter(x => x.includes('.log'));
    for (const logFile of logFiles) {
        await fs.unlink(logFile);
    }
    const appDataLogsFolderPath = join(getAppDataPath(), 'bellboy-logs');
    const folderExists = await getFileStats(appDataLogsFolderPath);
    if (folderExists) {
        const appDataFiles = await fs.readdir(appDataLogsFolderPath);
        for (const logFile of appDataFiles) {
            await fs.unlink(join(appDataLogsFolderPath, logFile));
        }
    }
});

class CustomDestination extends Destination {
    async loadBatch(rows: any) {
        // do nothing
    }
}

it('generated log file in user-specified folder must match expected events', async () => {
    const events: IBellboyEvent[] = [];
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 3; i++) {
                yield {
                    text: 'something'
                }
            }
        },
    });
    const destination = new CustomDestination();
    const job = new Job(processor, [destination], { reporters: [new LogReporter({ path: './' })] });
    job.onAny(undefined, async (event) => events.push(event));
    await job.run();
    const logFileContent = await getLogFileContent('./');
    expect(events.map(x => JSON.stringify(x)).join('\n') + '\n').toBe(logFileContent);
});

it('generated log file in appdata must match expected events', async () => {
    const events: IBellboyEvent[] = [];
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 3; i++) {
                yield {
                    text: 'something'
                }
            }
        },
    });
    const destination = new CustomDestination();
    const job = new Job(processor, [destination], { reporters: [new LogReporter()] });
    job.onAny(undefined, async (event) => events.push(event));
    await job.run();
    const logsFolderPath = join(getAppDataPath(), 'bellboy-logs');
    const logFileContent = await getLogFileContent(logsFolderPath);
    expect(events.map(x => JSON.stringify(x)).join('\n') + '\n').toBe(logFileContent);
});

