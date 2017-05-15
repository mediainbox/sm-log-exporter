# sm-log-exporter

Export [StreamMachine](https://github.com/StreamMachine/StreamMachine) session
logs from Elasticsearch as W3C or SoundExchange files, for importing to
external analytics systems.

## Prereqs

* Node.js (~0.10)
* HTTP access to the Elasticsearch server with SM logs

## Examples

 ''' ./runner-cmd --server http://server.yourdomain.net --index your-index-name --start 2017-05-14 --end 2017-05-15 --path '/station.mp3' --format w3c --zone 'UTC' > w3c.log '''
