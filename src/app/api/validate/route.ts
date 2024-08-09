import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { put } from '@vercel/blob';
import gtfsAccessibilityValidator from 'gtfs-accessibility-validator';
import { sortBy } from 'lodash';

export const maxDuration = 300; // 5 minutes

export const POST = async (request: Request) => {
  const headersList = headers();
  const authorizationHeader = headersList.get('authorization');

  if (
    !authorizationHeader ||
    authorizationHeader.replace('Bearer ', '') !== process.env.CRON_SECRET
  ) {
    return NextResponse.json(
      {
        error: 'Invalid Token',
        success: false,
      },
      { status: 401 },
    );
  }

  const agencies = [
    {
      agency_key: 'ac',
      url: 'https://api.actransit.org/transit/gtfs/download?token=2512B81107A09D2DC44895CDDC650D47',
    },
    {
      agency_key: 'angelisland',
      url: 'http://api.511.org/transit/datafeeds?operator_id=AF&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'ace',
      url: 'http://api.511.org/transit/datafeeds?operator_id=CE&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'bart',
      url: 'https://www.bart.gov/dev/schedules/google_transit.zip',
    },
    {
      agency_key: 'caltrain',
      url: 'https://data.trilliumtransit.com/gtfs/caltrain-ca-us/caltrain-ca-us.zip',
    },
    {
      agency_key: 'capitolcorridor',
      url: 'https://www.capitolcorridor.org/googletransit/GTFS.zip',
    },
    {
      agency_key: 'commuteorg',
      url: 'https://data.trilliumtransit.com/gtfs/commute-ca-us/commute-ca-us.zip',
    },
    {
      agency_key: 'countyconnection',
      url: 'http://cccta.org/GTFS/google_transit.zip',
    },
    {
      agency_key: 'dumbartonexpress',
      url: 'http://api.511.org/transit/datafeeds?operator_id=DE&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'emerygoround',
      url: 'https://emerygoround.com/data/emerygoround-ca-us.zip',
    },
    {
      agency_key: 'fast',
      url: 'http://data.trilliumtransit.com/gtfs/fairfield-ca-us/fairfield-ca-us.zip',
    },
    {
      agency_key: 'goldengate',
      url: 'https://realtime.goldengate.org/gtfsstatic/GTFSTransitData.zip',
    },
    {
      agency_key: 'goldengate_ferry',
      url: 'http://api.511.org/transit/datafeeds?operator_id=GF&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'goldengatepark',
      url: 'https://hosted-gtfs-feeds.s3.amazonaws.com/Golden+Gate+Park+Shuttle/gtfs.zip',
    },
    {
      agency_key: 'lavta',
      url: 'http://webwatch.lavta.org/TMGTFSRealTimeWebService/GTFS-Static/google_transit.zip',
    },
    {
      agency_key: 'marintransit',
      url: 'https://www.marintransit.org/data/google_transit.zip',
    },
    {
      agency_key: 'missionbay',
      url: 'https://data.trilliumtransit.com/gtfs/missionbaytma-ca-us/missionbaytma-ca-us.zip',
    },
    {
      agency_key: 'mvgo',
      url: 'https://mvgo.org/data/gtfs.zip',
    },
    {
      agency_key: 'mvcs',
      url: 'https://mvcommunityshuttle.com/data/gtfs.zip',
    },
    {
      agency_key: 'napa',
      url: 'https://data.trilliumtransit.com/gtfs/vinetransit-ca-us/vinetransit-ca-us.zip',
    },
    {
      agency_key: 'petalumatransit',
      url: 'http://data.trilliumtransit.com/gtfs/petalumatransit-petaluma-ca-us/petalumatransit-petaluma-ca-us.zip',
    },
    {
      agency_key: 'presidiogo',
      url: 'https://presidiobus.com/gtfs',
      exclude: ['directions'],
    },
    {
      agency_key: 'riovista',
      url: 'https://data.trilliumtransit.com/gtfs/riovista-ca-us/riovista-ca-us.zip',
    },
    {
      agency_key: 'samtrans',
      url: 'http://www.samtrans.com/Assets/GTFS/samtrans/st-gtfs.zip',
    },
    {
      agency_key: 'santarosa',
      url: 'http://api.511.org/transit/datafeeds?operator_id=SR&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'sctransit',
      url: 'https://data.trilliumtransit.com/gtfs/sonomacounty-ca-us/sonomacounty-ca-us.zip',
    },
    {
      agency_key: 'sfmta',
      url: 'http://api.511.org/transit/datafeeds?operator_id=SF&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'sfo',
      url: 'http://api.511.org/transit/datafeeds?operator_id=SI&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'smart',
      url: 'https://data.trilliumtransit.com/gtfs/smart-ca-us/smart-ca-us.zip',
    },
    {
      agency_key: 'soltrans',
      url: 'http://soltrans.connexionz.net/511/gtfs.zip',
    },
    {
      agency_key: 'southcity',
      url: 'http://api.511.org/transit/datafeeds?operator_id=SS&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'stanford',
      url: 'https://transportation-forms.stanford.edu/google/google_transit.zip',
    },
    {
      agency_key: 'tdt',
      url: 'http://rta.trideltatransit.com/511/gtfs.zip',
    },
    {
      agency_key: 'treasureisland',
      url: 'http://api.511.org/transit/datafeeds?operator_id=TF&api_key=3521fe85-8498-4ecd-8bc4-3c0e6491e32c',
    },
    {
      agency_key: 'unioncity',
      url: 'https://data.trilliumtransit.com/gtfs/unioncity-ca-us/unioncity-ca-us.zip',
    },
    {
      agency_key: 'vacaville',
      url: 'http://data.trilliumtransit.com/gtfs/vacavillecitycoach-ca-us/vacavillecitycoach-ca-us.zip',
    },
    {
      agency_key: 'vta',
      url: 'https://gtfs.vta.org/gtfs_vta.zip',
    },
    {
      agency_key: 'westcat',
      url: 'https://data.trilliumtransit.com/gtfs/westcat-ca-us/westcat-ca-us.zip',
    },
    {
      agency_key: 'weta',
      url: 'https://data.trilliumtransit.com/gtfs/sfbayferry-ca-us/sfbayferry-ca-us.zip',
    },
  ];

  const results = [];

  for (const agency of agencies) {
    const validationResults = await gtfsAccessibilityValidator({
      gtfsUrl: agency.url,
      verbose: false,
      ignoreDuplicates: true,
    });

    //remove API key from gtfsUrl
    const gtfsUrl = agency.url.replace(/(api_key=)([^&]*)/, '$1[API_KEY]');

    results.push({
      ...validationResults,
      gtfsUrl,
    });
  }

  await put(
    'gtfs-accessibility-report.json',
    JSON.stringify(sortBy(results, 'agency')),
    {
      access: 'public',
      addRandomSuffix: false,
      cacheControlMaxAge: 0, // 1 hour
    },
  );

  return NextResponse.json({
    success: true,
  });
};
