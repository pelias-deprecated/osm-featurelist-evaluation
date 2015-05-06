
var pbf2json = require('pbf2json'),
    through = require('through2'),
    fs = require('fs'),
    path = require('path');

var pbfFile = '/media/hdd/mapzen-metro/new-york_new-york.osm.pbf';

var tags = {
  'address':            'addr:housenumber+addr:street',
  'amenity':            'amenity+name',
  'building':           'building+name',
  'shop':               'shop+name',
  'office':             'office+name',
  'public_transport':   'public_transport+name',
  'cuisine':            'cuisine+name',
  'railway':            'railway+name',
  'sport':              'sport+name',
  'natural':            'natural+name',
  'tourism':            'tourism+name',
  'leisure':            'leisure+name',
  'historic':           'historic+name',
  'man_made':           'man_made+name',
  'landuse':            'landuse+name',
  'waterway':           'waterway+name',
  'aerialway':          'aerialway+name',
  'aeroway':            'aeroway+name',
  'craft':              'craft+name',
  'military':           'military+name'
};

// create a db file for each tag
var files = {};
function truncateFiles(){
  for( var attr in tags ){
    var filename = path.resolve( __dirname, 'cuts', attr );
    fs.writeFileSync( filename + '.json', '' ); // truncate file
    fs.writeFileSync( filename + '.text', '' ); // truncate file
    files[attr] = filename;
  }
}

truncateFiles();

// compile the taglist to pass to pbf2json
var taglist = [];
for( var attr in tags ){
  taglist.push(tags[attr]);
}

// run pbf2json
pbf2json.createReadStream({ file: pbfFile, tags: taglist.join(','), leveldb: '/tmp' })
 .pipe( through.obj( function( item, e, next ){

    // delete some props we don't need in the json
    delete item.nodes;
    delete item.refs;
    delete item.timestamp;

    var jsonify = JSON.stringify( item, null, 2 ) + '\n';
    var textify = [ item.type, item.id, item.tags.name ].join('\t') + '\n';

    // iterate over the tags and send relevant documents to
    // the relevant db
    for( var attr in tags ){

      var taglist = tags[attr].split('+');

      // create a list of matching tags
      var tagsPresent = taglist.filter( function( tag ){
        return item.tags.hasOwnProperty(tag);
      });

      // write item to relevant db
      if( tagsPresent.length === taglist.length ){
        fs.appendFile( files[attr] + '.json', jsonify );
        fs.appendFile( files[attr] + '.text', textify );
      }

    }

    next();
 }));