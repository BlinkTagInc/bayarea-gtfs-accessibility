import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { put } from '@vercel/blob';
import gtfsAccessibilityValidator from 'gtfs-accessibility-validator';
import { sortBy } from 'lodash';

import agencies from '@/data/agencies.json';

export const maxDuration = 300; // 5 minutes

export const GET = async (request: Request) => {
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

  const results = [];

  for (const agency of agencies) {
    const validationResults = await gtfsAccessibilityValidator({
      gtfsUrl: agency.url,
      verbose: false,
      ignoreDuplicates: true,
    });

    // Remove API key from gtfsUrl
    const cleanedGtfsUrl = agency.url
      .replace(/(api_key=)([^&]*)/, '$1[API_KEY]')
      .replace(/(token=)([^&]*)/, '$1[API_KEY]');

    results.push({
      ...validationResults,
      gtfs_url: cleanedGtfsUrl,
      validation_date: new Date().toISOString(),
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

  return NextResponse.json(
    {
      success: true,
    },
    {
      headers: {
        'Cache-Control': 'no-cache',
      },
    },
  );
};
