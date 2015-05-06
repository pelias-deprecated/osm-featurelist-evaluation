
This repo contains some basic scripts used to determine which openstreetmap features are important to import for geocoding and allow us to quickly review the data.

### nyc extract

I've committed the files from a NYC extract so you can get an idea of which sort of names come from which tags [here](https://github.com/pelias/osm-featurelist-evaluation/tree/master/cuts).

### run the scripts yourself

Specify the `.pbf` file you wish to use and the features you would like extracted here: https://github.com/pelias/osm-featurelist-evaluation/blob/master/extract.js#L7

```bash
$> npm install;
$> npm run extract;
```

This will run for some time (depending on the pbf size) and generate some dumps in `./cuts`, only the `.text` files are uploaded here as the `.json` files are too large for github (>100MB), if you need them you'll have to run it locally.