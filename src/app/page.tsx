import { ReportTable } from '@/ReportTable';

export default async function Home() {
  return (
    <>
      <main className="min-h-screen px-3 py-4 md:p-10">
        <div className="card max-w-[650px] mb-10">
          <h1 className="text-3xl mb-4 text-center">
            Bay Area GTFS Accessibility Report
          </h1>
          <p className="leading-tight text-center">
            An audit of 40 San Francisco Bay Area Transit Agencies using the{' '}
            <a href="https://dot.ca.gov/cal-itp/california-transit-data-guidelines-v3_0#section-checklist">
              California Transit Data Guidelines
            </a>{' '}
            published by Caltrans.
          </p>
        </div>
        <div className="mb-10 max-w-[1200px] mx-auto">
          <ReportTable />
        </div>

        <div className="flex flex-col gap-8">
          <div className="card max-w-[650px] mx-auto">
            <h2>About This Report</h2>
            <p>Each agency&apos;s GTFS is checked nightly for:</p>
            <ul className="mb-3">
              <li>
                <code>wheelchair_accessible</code> field in{' '}
                <code>trips.txt</code>
              </li>
              <li>
                <code>wheelchair_boarding</code> field in <code>stops.txt</code>
              </li>
              <li>
                <code>tts_stop_name</code> field in <code>stops.txt</code>
              </li>
              <li>
                <code>levels.txt</code> file
              </li>
              <li>
                <code>pathways.txt</code> file
              </li>
              <li>
                Contrast ratio between <code>route_color</code> and{' '}
                <code>route_text_color</code> in <code>routes.txt</code>
              </li>
            </ul>
          </div>

          <div
            className="card max-w-[650px]"
            id="tripsWithWheelchairAccessibility"
          >
            <h2>Accessibility Guidelines</h2>
            <div>
              The accessibility guidelines below are taken from the{' '}
              <a href="https://dot.ca.gov/cal-itp/california-transit-data-guidelines-v3_0#section-checklist">
                California Transit Data Guidelines
              </a>{' '}
              published by Caltrans.
            </div>
          </div>

          <div
            className="card max-w-[650px]"
            id="tripsWithWheelchairAccessibility"
          >
            <h3>
              <code>wheelchair_accessible</code> field in <code>trips.txt</code>
            </h3>

            <p>
              <strong>Guideline:</strong> The <code>wheelchair_accessible</code>{' '}
              field has a valid, non-empty, and non-null value for every entry
              in the <code>trips.txt</code> file.
            </p>

            <p>
              Transit riders with wheelchairs and other mobility aids encounter
              distinct challenges in accessing transit, including the
              uncertainty as to whether their devices can be used on specific
              scheduled trips.
            </p>

            <p>
              Transit providers should support the ability of these riders to
              plan and take trips on transit by publishing information about the
              trips on which wheelchair users may or may not be able to travel
              in trip-planning applications.
            </p>
          </div>
          <div className="card max-w-[650px]" id="stopsWithWheelchairBoarding">
            <h3>
              <code>wheelchair_boarding</code> field in <code>stops.txt</code>
            </h3>
            <p>
              <strong>Guideline:</strong> The <code>wheelchair_boarding</code>{' '}
              field has a valid, non-empty, and non-null value for every entry
              in the <code>stops.txt</code> file.
            </p>

            <p>
              Transit riders with wheelchairs and other mobility aids encounter
              distinct challenges in accessing transit, including uncertainty as
              to whether they can board and alight at particular locations using
              their devices.
            </p>

            <p>
              Transit providers should support the ability of these riders to
              plan and take trips on transit by publishing information about the
              locations where wheelchair users can and cannot access the system
              in trip-planning applications.
            </p>
          </div>
          <div className="card max-w-[650px]" id="stopsWithTTSStopName">
            <h3>
              <code>tts_stop_name</code> field in <code>stops.txt</code>
            </h3>
            <p>
              <strong>Guideline:</strong> The <code>tts_stop_name</code> field
              should include correct pronunciation for all stop names in{' '}
              <code>stops.txt</code> that are commonly mispronounced in
              trip-planning applications.
            </p>

            <p>
              Audio annunciation of stop names is an important wayfinding tool
              for transit riders with visual impairments.
            </p>

            <p>
              Transit providers should support the ability of these riders to
              conveniently and accurately plan and take trips on transit by
              ensuring that stop names will be pronounced correctly in
              trip-planning applications.
            </p>

            <p>
              BlinkTag created a different open source tool to review GTFS stop
              name pronunciations and determine which stops need a{' '}
              <code>tts_stop_name value</code>. See{' '}
              <a href="https://github.com/BlinkTagInc/gtfs-tts">
                GTFS Text-to-Speech Tester
              </a>
              .
            </p>
          </div>
          <div className="card max-w-[650px]" id="hasLevels">
            <h3 id="hasPathways">
              <code>levels.txt</code> and <code>pathways.txt</code> files
            </h3>
            <p>
              <strong>Guideline:</strong> Sufficient data is included within{' '}
              <code>stops.txt</code>, <code>pathways.txt</code>, and{' '}
              <code>levels.txt</code> to navigate to, from, and between any
              boarding zone to street level with varying physical abilities,
              including <code>pathway_mode</code> and <code>stair_count</code>{' '}
              where applicable. This includes but is not limited to any stops
              that use <code>parent_station</code> in <code>stops.txt</code> as
              well as all significant or named transit facilities where an
              infrequent visitor may be concerned about accessibility.
            </p>

            <p>
              Transit riders with wheelchairs and other mobility aids encounter
              distinct challenges in accessing transit, including uncertainty
              about navigating between boarding zones and street level at stops.
            </p>

            <p>
              Transit providers should support the ability of these riders to
              plan and take trips on transit by providing sufficient information
              for them to find accessible paths on and off transit using mobile
              applications.
            </p>
          </div>
          <div className="card max-w-[650px]" id="routeColorContrastIsValid">
            <h3>
              Contrast ratio between <code>route_color</code> and{' '}
              <code>route_text_color</code> in <code>routes.txt</code>
            </h3>
            <p>
              <strong>Guideline:</strong> WCAG AA Large Text Contrast
            </p>

            <p>
              Routes are often identified using the <code>route_color</code>{' '}
              field in <code>routes.txt</code>. Often, the{' '}
              <code>route_short_name</code> is used as text on top of the{' '}
              <code>route_color</code> using the <code>route_text_color</code>.
            </p>
          </div>
        </div>
      </main>

      <div className="footer">
        Created by <a href="https://blinktag.com">BlinkTag Inc</a>
        <br />
        Powered by{' '}
        <a href="https://validator.blinktag.com">
          GTFS Accessibility Validator
        </a>
        <br />
        <a href="https://gtfstohtml.com/docs/related-libraries">
          Other GTFS Tools
        </a>
        <br />
        Contribute on{' '}
        <a href="https://github.com/BlinkTagInc/bayarea-gtfs-accessibility">
          Github
        </a>
      </div>
    </>
  );
}
