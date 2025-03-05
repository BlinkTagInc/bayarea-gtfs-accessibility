export const ReportTable = async () => {
  // Read accessibility json from vercel blob
  const response = await fetch(
    'https://vzk68paqupzrscvv.public.blob.vercel-storage.com/gtfs-accessibility-report.json',
    {
      next: {
        revalidate: 3600, // 1 hour
      },
    },
  );
  const results: {
    stats: {
      id: string;
      name: string;
      status: string;
      value: string;
      routes?: { route_short_name: string; route_long_name: string }[];
    }[];
    agency: string;
    feed_version: string;
    feed_start_date: string;
    feed_end_date: string;
    gtfs_url: string;
    validation_date: string;
  }[] = await response.json();

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // 511.org agencies have levels or pathways as part of the regional feed
  for (const result of results) {
    if (result.gtfs_url.includes('api.511.org')) {
      const levelsStat = result.stats.find((stat) => stat.id === 'hasLevels');
      const pathwaysStat = result.stats.find(
        (stat) => stat.id === 'hasPathways',
      );
      if (levelsStat) {
        levelsStat.status = 'pass';
      }
      if (pathwaysStat) {
        pathwaysStat.status = 'pass';
      }
    }
  }

  return (
    <>
      <div>
        Updated{' '}
        {results[0]?.validation_date &&
          dateFormatter.format(new Date(results[0]?.validation_date))}
      </div>
      <table className="mt-2">
        <thead>
          <tr>
            <th>Agency</th>
            <th className="text-sm w-[120px]">
              <a href="#tripsWithWheelchairAccessibility">
                wheelchair_accessible in trips.txt
              </a>
            </th>
            <th className="text-sm w-[120px]">
              <a href="#stopsWithWheelchairBoarding">
                wheelchair_boarding in stops.txt
              </a>
            </th>
            <th className="text-sm w-[120px]">
              <a href="#stopsWithTTSStopName">tts_stop_name in stops.txt</a>
            </th>
            <th className="text-sm w-[120px]">
              <a href="#hasLevels">has levels.txt</a>
            </th>
            <th className="text-sm w-[120px]">
              <a href="#hasPathways">has pathways.txt</a>
            </th>
            <th className="text-sm w-[120px]">
              <a href="#routeColorContrastIsValid">
                route_color contrast ratio ok
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const tripsWithWheelchairAccessibility = result.stats.find(
              (stat) => stat.id === 'tripsWithWheelchairAccessibility',
            );
            const stopsWithWheelchairBoarding = result.stats.find(
              (stat) => stat.id === 'stopsWithWheelchairBoarding',
            );
            const routeColorContrastIsValid = result.stats.find(
              (stat) => stat.id === 'routeColorContrastIsValid',
            );
            return (
              <tr key={result.agency}>
                <td>
                  <a href={result.gtfs_url} title="Download GTFS">
                    {result.agency}
                  </a>
                </td>
                <td>
                  {tripsWithWheelchairAccessibility?.status == 'pass' ? (
                    '✅'
                  ) : (
                    <span
                      title={tripsWithWheelchairAccessibility?.name}
                      className="text-red-800 font-bold"
                    >
                      ❌ {tripsWithWheelchairAccessibility?.value}
                    </span>
                  )}
                </td>
                <td>
                  {stopsWithWheelchairBoarding?.status == 'pass' ? (
                    '✅'
                  ) : (
                    <span
                      title={stopsWithWheelchairBoarding?.name}
                      className="text-red-800 font-bold"
                    >
                      ❌ {stopsWithWheelchairBoarding?.value}
                    </span>
                  )}
                </td>
                <td>
                  {result.stats.find(
                    (stat) => stat.id === 'stopsWithTTSStopName',
                  )?.status == 'pass'
                    ? '✅'
                    : '❌'}
                </td>
                <td>
                  {result.stats.find((stat) => stat.id === 'hasLevels')
                    ?.status == 'pass' ? (
                    <span title="levels.txt is present in the 511.org regional feed">
                      ✅
                    </span>
                  ) : (
                    '❌'
                  )}
                </td>
                <td>
                  {result.stats.find((stat) => stat.id === 'hasPathways')
                    ?.status == 'pass' ? (
                    <span title="pathways.txt is present in the 511.org regional feed">
                      ✅
                    </span>
                  ) : (
                    '❌'
                  )}
                </td>
                <td>
                  {routeColorContrastIsValid?.status == 'pass' ? (
                    '✅'
                  ) : (
                    <span
                      title={`${routeColorContrastIsValid?.name}: ${routeColorContrastIsValid?.routes?.map((route) => `${route.route_short_name} ${route.route_long_name}`).join(', ')}`}
                      className="text-red-800 font-bold"
                    >
                      ❌ {routeColorContrastIsValid?.value}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
