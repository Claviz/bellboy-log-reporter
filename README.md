[![Build Status](https://travis-ci.org/Claviz/bellboy-log-reporter.svg?branch=master)](https://travis-ci.org/Claviz/bellboy-log-reporter)
[![codecov](https://codecov.io/gh/Claviz/bellboy-log-reporter/branch/master/graph/badge.svg)](https://codecov.io/gh/Claviz/bellboy-log-reporter)
![npm](https://img.shields.io/npm/v/bellboy-log-reporter.svg)

# bellboy-log-reporter

Log [bellboy](https://github.com/Claviz/bellboy) events to the file system.

## Installation
```
npm install bellboy-log-reporter
```

## Usage

```javascript
const bellboy = require('bellboy');
const LogReporter = require('bellboy-log-reporter');

(async () => {
    const processor = new bellboy.DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 100; i++) {
                yield { hello: `world_${i}` }
            }
        },
    });
    const destination = new bellboy.StdoutDestination();
    const job = new bellboy.Job(processor, [destination], {
        reporters: [
            new LogReporter(),
        ],
    });
    await job.run();
})();
```

### Options

| option | type     | description                                                                                                                         |
|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------|
| path   | `string` | Path to the folder where logs will be stored. If not specified, logs will be saved to the `bellboy-logs` folder inside `%AppData%`. |

## Building

You can build `js` source by using `npm run build` command.

## Testing

Tests can be run by using `npm test` command.
