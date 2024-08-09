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
    gtfsUrl: string;
  }[] = await response.json();

  return (
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
                <a href={result.gtfsUrl} title="Download GTFS">
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
                {result.stats.find((stat) => stat.id === 'stopsWithTTSStopName')
                  ?.status == 'pass'
                  ? '✅'
                  : '❌'}
              </td>
              <td>
                {result.stats.find((stat) => stat.id === 'hasLevels')?.status ==
                'pass'
                  ? '✅'
                  : '❌'}
              </td>
              <td>
                {result.stats.find((stat) => stat.id === 'hasPathways')
                  ?.status == 'pass'
                  ? '✅'
                  : '❌'}
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
  );
};
