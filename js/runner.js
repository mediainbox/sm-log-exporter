var ES, FORMATTERS, SessionPuller, SoundExFormatter, UserAgentFormatter, W3CFormatter, argv, debug, end_date, es, format, formatter, path, puller, start_date, tz, zone;

debug = require("debug")("sm-log-exporter");

ES = require("elasticsearch");

tz = require("timezone");

SessionPuller = require("./session_puller");

W3CFormatter = require("./w3c_formatter");

SoundExFormatter = require("./soundexchange_formatter");

UserAgentFormatter = require("./useragent_formatter");

FORMATTERS = {
  w3c: W3CFormatter,
  soundexchange: SoundExFormatter,
  ua: UserAgentFormatter
};

argv = require("yargs").options({
  server: {
    describe: "Elasticsearch Server",
    demand: true,
    requiresArg: true
  },
  start: {
    describe: "Start Date",
    demand: true,
    requiresArg: true
  },
  end: {
    describe: "End Date",
    demand: true,
    requiresArg: true
  },
  path: {
    describe: "Path name to filter only one radio",
    "default": null
  },
  zone: {
    describe: "Timezone for dates",
    "default": "UTC"
  },
  min_duration: {
    describe: "Minimum seconds for session",
    "default": null
  },
  max_duration: {
    describe: "Maximum seconds for session",
    "default": null
  },
  index: {
    describe: "ES Index Prefix",
    "default": "streammachine"
  },
  format: {
    describe: "Output format (w3c or soundexchange)",
    "default": "w3c"
  }
}).argv;

if (argv.zone !== "UTC") {
  zone = tz(require("timezone/" + argv.zone));
} else {
  zone = tz;
}

formatter = FORMATTERS[argv.format];

if (!formatter) {
  console.error("Invalid format. Options: " + (Object.keys(FORMATTERS).join(", ")) + "\n");
  process.exit(1);
}

es = new ES.Client({
  host: argv.server
});

start_date = zone(argv.start, argv.zone);

end_date = zone(argv.end, argv.zone);

path = argv.path;

console.error("Stats: " + start_date + " - " + end_date);

puller = new SessionPuller(es, argv.index, start_date, end_date, path);

format = new formatter(argv.min_duration, argv.max_duration);

puller.stream.pipe(format).pipe(process.stdout);

format.on("end", (function(_this) {
  return function() {
    console.error("all done");
    return process.exit();
  };
})(this));

//# sourceMappingURL=runner.js.map
