The Bay Area GTFS Accessibility site validates the accessibility fields of all 40 Bay Area transit agencies.

It checks for:

* `wheelchair_accessible` field in `trips.txt`
* `wheelchair_boarding` field in `stops.txt`
* `tts_stop_name` field in `stops.txt`
* `levels.txt` file
* `pathways.txt` file
* Contrast ratio between `route_color` and `route_text_color` in `routes.txt`

These accessibility guidelines are taken from the [California Transit Data Guidelines](https://dot.ca.gov/cal-itp/california-transit-data-guidelines-v3_0#section-checklist) published by Caltrans.

It uses the [GTFS Accessibility Validator tool](https://validator.blinktag.com).
