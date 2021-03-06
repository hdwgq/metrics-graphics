import { curveCatmullRom, curveBasisClosed, curveBasisOpen, curveBasis, curveBundle, curveCardinalClosed, curveCardinalOpen, curveCardinal, curveCatmullRomClosed, curveCatmullRomOpen, curveLinearClosed, curveLinear, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore } from 'd3-shape'
import { optionsToDefaults } from '../misc/utility'

export const globals = {
  link: false,
  version: '2.0'
}

export const options = { // <name>: [<defaultValue>, <availableType>]
  xAxisType: [null, ['categorical']], // TO BE INTRODUCED IN 2.10
  yAxisType: [null, ['categorical']], // TO BE INTRODUCED IN 2.10
  y_padding_percentage: [0.05, 'number'], // for categorical scales
  y_outer_padding_percentage: [0.1, 'number'], // for categorical scales
  ygroup_padding_percentage: [0.25, 'number'], // for categorical scales
  ygroup_outer_padding_percentage: [0, 'number'], // for categorical scales
  x_padding_percentage: [0.05, 'number'], // for categorical scales
  x_outer_padding_percentage: [0.1, 'number'], // for categorical scales
  xgroup_padding_percentage: [0.25, 'number'], // for categorical scales
  xgroup_outer_padding_percentage: [0, 'number'], // for categorical scales
  yGroupAccessor: [null, 'string'],
  xgroup_accessor: [null, 'string'],
  yCategoricalShowGuides: [false, 'boolean'],
  x_categorical_show_guide: [false, 'boolean'],
  rotateXLabels: [0, 'number'],
  rotateYLabels: [0, 'number'],
  scales: [{}],
  scaleFunctions: [{}],
  // Data
  data: [[], ['object[]', 'number[]']], // the data object
  missingIsZero: [false, 'boolean'], // assume missing observations are zero
  missingIsHidden: [false, 'boolean'], // show missing observations as missing line segments
  missingIsHidden_accessor: [null, 'string'], // the accessor for identifying observations as missing
  utcTime: [false, 'boolean'], // determines whether to use a UTC or local time scale
  xAccessor: ['date', 'string'], // the data element that's the x-accessor
  xSort: [true, 'boolean'], // determines whether to sort the x-axis' values
  yAccessor: ['value', ['string', 'string[]']], // the data element that's the y-accessor
  // Axes
  axesNotCompact: [true, 'boolean'], // determines whether to draw compact or non-compact axes
  europeanClock: [false, 'boolean'], // determines whether to show labels using a 24-hour clock
  inflator: [10 / 9, 'number'], // a multiplier for inflating maxX and maxY
  maxX: [null, ['number', Date]], // the maximum x-value
  maxY: [null, ['number', Date]], // the maximum y-value
  minX: [null, ['number', Date]], // the minimum x-value
  minY: [null, ['number', Date]], // the minimum y-value
  minY_from_data: [false, 'boolean'], // starts y-axis at data's minimum value
  showYearMarkers: [false, 'boolean'], // determines whether to show year markers along the x-axis
  showSecondaryXLabel: [true, 'boolean'], // determines whether to show years along the x-axis
  small_text: [false, 'boolean'],
  xExtendedTicks: [false, 'boolean'], // determines whether to extend the x-axis ticks across the chart
  xAxis: [true, 'boolean'], // determines whether to display the x-axis
  xLabel: ['', 'string'], // the label to show below the x-axis
  xaxCount: [6, 'number'], // the number of x-axis ticks
  xaxFormat: [null, 'function'], // a function that formats the x-axis' labels
  xaxTickLength: [5, 'number'], // the x-axis' tick length in pixels
  xaxUnits: ['', 'string'], // a prefix symbol to be shown alongside the x-axis' labels
  xScaleType: ['linear', 'log'], // the x-axis scale type
  yAxis: [true, 'boolean'], // determines whether to display the y-axis
  xAxis_position: ['bottom'], // string
  yAxis_position: ['left'], // string
  yExtendedTicks: [false, 'boolean'], // determines whether to extend the y-axis ticks across the chart
  yLabel: ['', 'string'], // the label to show beside the y-axis
  yScaleType: ['linear', ['linear', 'log']], // the y-axis scale type
  yax_count: [3, 'number'], // the number of y-axis ticks
  yaxFormat: [null, 'function'], // a function that formats the y-axis' labels
  yaxTickLength: [5, 'number'], // the y-axis' tick length in pixels
  yaxUnits: ['', 'string'], // a prefix symbol to be shown alongside the y-axis' labels
  yaxUnitsAppend: [false, 'boolean'], // determines whether to append rather than prepend units
  // GraphicOptions
  aggregateRollover: [false, 'boolean'], // links the lines in a multi-line graphic
  animateOnLoad: [false, 'boolean'], // determines whether lines are transitioned on first-load
  area: [true, ['boolean', 'array']], // determines whether to fill the area below the line
  flipAreaUnderYValue: [null, 'number'], // Specify a Y baseline number value to flip area under it
  baselines: [null, 'object[]'], // horizontal lines that indicate, say, goals.
  chartType: ['line', ['line', 'histogram', 'point', 'bar', 'missing-data']], // '{line, histogram, point, bar, missing-data}'],
  color: [null, ['string', 'string[]']],
  colors: [null, ['string', 'string[]']],
  customLineColorMap: [[], 'number[]'], // maps an arbitrary set of lines to colors
  decimals: [2, 'number'], // the number of decimals to show in a rollover
  error: ['', 'string'], // does the graphic have an error that we want to communicate to users
  format: ['count', ['count', 'percentage']], // the format of the data object (count or percentage)
  full_height: [false, 'boolean'], // sets height to that of the parent, adjusts dimensions on window resize
  fullWidth: [false, 'boolean'], // sets width to that of the parent, adjusts dimensions on window resize
  interpolate: [curveCatmullRom.alpha(0), [curveBasisClosed, curveBasisOpen, curveBasis, curveBundle, curveCardinalClosed, curveCardinalOpen, curveCardinal, curveCatmullRomClosed, curveCatmullRomOpen, curveLinearClosed, curveLinear, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore]], // the interpolation function to use for rendering lines
  legend: ['', 'string[]'], // an array of literals used to label lines
  legendTarget: ['', 'string'], // the DOM element to insert the legend in
  linked: [false, 'boolean'], // used to link multiple graphics together
  linkedFormat: ['%Y-%m-%d', 'string'], // specifies the format of linked rollovers
  list: [false, 'boolean'], // automatically maps the data to x and y accessors
  markers: [null, 'object[]'], // vertical lines that indicate, say, milestones
  max_data_size: [null, 'number'], // for use with customLineColorMap
  missingText: [null, 'string'], // The text to display for missing graphics
  show_missing_background: [true, 'boolean'], // Displays a background for missing graphics
  mousemove_align: ['right', 'string'], // implemented in point.js
  xMouseover: [null, ['string', 'function']],
  yMouseover: [null, ['string', 'function']],
  mouseover: [null, 'function'], // custom rollover function
  mousemove: [null, 'function'], // custom rollover function
  mouseout: [null, 'function'], // custom rollover function
  click: [null, 'function'],
  pointSize: [2.5, 'number'], // the radius of the dots in the scatterplot
  active_point_on_lines: [false, 'boolean'], // if set, active dot on lines will be displayed.
  active_point_accessor: ['active', 'string'], // data accessor value to determine if a point is active or not
  active_pointSize: [2, 'number'], // the size of the dot that appears on a line when
  points_always_visible: [false, 'boolean'], //  whether to always display data points and not just on hover
  rollover_time_format: [null, 'string'], // custom time format for rollovers
  showConfidenceBand: [null, 'string[]'], // determines whether to show a confidence band
  show_rollover_text: [true, 'boolean'], // determines whether to show text for a data point on rollover
  show_tooltips: [true, 'boolean'], // determines whether to display descriptions in tooltips
  showActivePoint: [true, 'boolean'], // If enabled show active data point information in chart

  /** the DOM element to insert the graphic in */
  target: ['#viz', ['string', HTMLElement]], // eslint-disable-line

  transitionOnUpdate: [true, 'boolean'], // gracefully transitions the lines on data change
  xRug: [false, 'boolean'], // show a rug plot along the x-axis
  yRug: [false, 'boolean'], // show a rug plot along the y-axis
  mouseover_align: ['right', ['right', 'left']],
  brush: [null, ['xy', 'x', 'y']], // add brush function
  brushing_selection_changed: [null, 'function'], // callback function on brushing. the first parameter are the arguments that correspond to this chart, the second parameter is the range of the selection
  zoom_target: [null, 'object'], // the zooming target of brushing function
  click_to_zoom_out: [true, 'boolean'], // if true and the graph is currently zoomed in, clicking on the graph will zoom out
  // Layout
  buffer: [8, 'number'], // the padding around the graphic
  bottom: [45, 'number'], // the size of the bottom margin
  center_title_fullWidth: [false, 'boolean'], // center title over entire graph
  height: [220, 'number'], // the graphic's height
  left: [50, 'number'], // the size of the left margin
  right: [10, 'number'], // the size of the right margin
  small_height_threshold: [120, 'number'], // maximum height for a small graphic
  small_width_threshold: [160, 'number'], // maximum width for a small graphic
  top: [65, 'number'], // the size of the top margin
  width: [350, 'number'], // the graphic's width
  titleYPosition: [10, 'number'], // how many pixels from the top edge (0) should we show the title at
  title: [null, 'string'],
  description: [null, 'string']
}

export const defaults = optionsToDefaults(options)
