import { getSvgChildOf, targetRef, arrayDiff, countArrayElements } from '../misc/utility'
import { select } from 'd3-selection'
import { defaultXaxFormat, defaultBarXaxFormat } from '../axis/xAxis'
import { max } from 'd3-array'
import { chartTitle } from './chartTitle'

export function removeSvgIfChartTypeHasChanged (svg, args) {
  if ((!svg.selectAll('.mg-main-line').empty() && args.chartType !== 'line') ||
    (!svg.selectAll('.mg-points').empty() && args.chartType !== 'point') ||
    (!svg.selectAll('.mg-histogram').empty() && args.chartType !== 'histogram') ||
    (!svg.selectAll('.mg-barplot').empty() && args.chartType !== 'bar')
  ) {
    svg.remove()
  }
}

export function addSvgIfItDoesntExist (svg, args) {
  if (getSvgChildOf(args.target).empty()) {
    svg = select(args.target)
      .append('svg')
      .classed('linked', args.linked)
      .attr('width', args.width)
      .attr('height', args.height)
  }
  return svg
}

export function addClipPathForPlotArea (svg, args) {
  svg.selectAll('.mg-clip-path').remove()
  svg.append('defs')
    .attr('class', 'mg-clip-path')
    .append('clipPath')
    .attr('id', 'mg-plot-window-' + targetRef(args.target))
    .append('svg:rect')
    .attr('x', args.left)
    .attr('y', args.top)
    .attr('width', args.width - args.left - args.right - args.buffer)
    .attr('height', args.height - args.top - args.bottom - args.buffer + 1)
}

export function adjustWidthAndHeightIfChanged (svg, args) {
  if (args.width !== Number(svg.attr('width'))) {
    svg.attr('width', args.width)
  }
  if (args.height !== Number(svg.attr('height'))) {
    svg.attr('height', args.height)
  }
}

export function setViewboxForScaling (svg, args) {
  // we need to reconsider how we handle automatic scaling
  svg.attr('viewBox', '0 0 ' + args.width + ' ' + args.height)
  if (args.fullWidth || args.full_height) {
    svg.attr('preserveAspectRatio', 'xMinYMin meet')
  }
}

export function removeMissingClassesAndText (svg) {
  // remove missing class
  svg.classed('mg-missing', false)

  // remove missing text
  svg.selectAll('.mg-missing-text').remove()
  svg.selectAll('.mg-missing-pane').remove()
}

export function removeOutdatedLines (svg, args) {
  // if we're updating an existing chart and we have fewer lines than
  // before, remove the outdated lines, e.g. if we had 3 lines, and we're calling
  // dataGraphic() on the same target with 2 lines, remove the 3rd line

  let i = 0

  if (svg.selectAll('.mg-main-line').nodes().length >= args.data.length) {
    // now, the thing is we can't just remove, say, line3 if we have a custom
    // line-color map, instead, see which are the lines to be removed, and delete those
    if (args.customLineColorMap.length > 0) {
      const arrayFullSeries = function (len) {
        const arr = new Array(len)
        for (let i = 0; i < arr.length; i++) { arr[i] = i + 1 }
        return arr
      }

      // get an array of lines ids to remove
      const linesToRemove = arrayDiff(
        arrayFullSeries(args.max_data_size),
        args.customLineColorMap)

      for (i = 0; i < linesToRemove.length; i++) {
        svg.selectAll('.mg-main-line.mg-line' + linesToRemove[i] + '-color')
          .remove()
      }
    } else {
      // if we don't have a custom line-color map, just remove the lines from the end
      const newCount = args.data.length
      const existingCount = (svg.selectAll('.mg-main-line').nodes()) ? svg.selectAll('.mg-main-line').nodes().length : 0

      for (i = existingCount; i > newCount; i--) {
        svg.selectAll('.mg-main-line.mg-line' + i + '-color')
          .remove()
      }
    }
  }
}

export function raiseContainerError (container, target) {
  if (container.empty()) {
    console.warn('The specified target element "' + target + '" could not be found in the page. The chart will not be rendered.')
  }
}

export function categoricalInitialization (args, ns) {
  const which = ns === 'x' ? args.width : args.height
  categoricalCountNumberOfGroups(args, ns)
  categoricalCountNumberOfLanes(args, ns)
  categoricalCalculateGroupLength(args, ns, which)
  if (which) categoricalCalculateBarThickness(args, ns)
}

export function selectXaxFormat (args) {
  const c = args.chartType
  if (!args.processed.xaxFormat) {
    if (args.xaxFormat) {
      args.processed.xaxFormat = args.xaxFormat
    } else {
      if (c === 'line' || c === 'point' || c === 'histogram') {
        args.processed.xaxFormat = defaultXaxFormat(args)
      } else if (c === 'bar') {
        args.processed.xaxFormat = defaultBarXaxFormat(args)
      }
    }
  }
}

export function categoricalCountNumberOfGroups (args, ns) {
  const accessorString = ns + 'group_accessor'
  const accessor = args[accessorString]
  args.categoricalGroups = []
  if (accessor) {
    const data = args.data[0]
    args.categoricalGroups = Array.from(new Set(data.map(function (d) {
      return d[accessor]
    })))
  }
}

export function categoricalCountNumberOfLanes (args, ns) {
  const accessorString = ns + 'group_accessor'
  const groupAccessor = args[accessorString]

  args.total_bars = args.data[0].length
  if (groupAccessor) {
    let groupBars = countArrayElements(args.data[0].map(groupAccessor))
    groupBars = max(Object.keys(groupBars).map(function (d) {
      return groupBars[d]
    }))
    args.bars_per_group = groupBars
  } else {
    args.bars_per_group = args.data[0].length
  }
}

export function categoricalCalculateGroupLength (args, ns, which) {
  const groupHeight = ns + 'group_height'
  if (which) {
    const gh = ns === 'y'
      ? (args.height - args.top - args.bottom - args.buffer * 2) / (args.categoricalGroups.length || 1)
      : (args.width - args.left - args.right - args.buffer * 2) / (args.categoricalGroups.length || 1)

    args[groupHeight] = gh
  } else {
    const step = (1 + args[ns + '_padding_percentage']) * args.bar_thickness
    args[groupHeight] = args.bars_per_group * step + args[ns + '_outer_padding_percentage'] * 2 * step // args.bar_thickness + (((args.bars_per_group-1) * args.bar_thickness) * (args.bar_padding_percentage + args.barOuterPaddingPercentage*2));
  }
}

export function categoricalCalculateBarThickness (args, ns) {
  // take one group height.
  const step = (args[ns + 'group_height']) / (args.bars_per_group + args[ns + '_outer_padding_percentage'])
  args.bar_thickness = step - (step * args[ns + '_padding_percentage'])
}

export function categoricalCalculateHeight (args, ns) {
  const groupContribution = (args[ns + 'group_height']) * (args.categoricalGroups.length || 1)

  const marginContribution = ns === 'y'
    ? args.top + args.bottom + args.buffer * 2
    : args.left + args.right + args.buffer * 2

  return groupContribution + marginContribution +
    (args.categoricalGroups.length * args[ns + 'group_height'] * (args[ns + 'group_padding_percentage'] + args[ns + 'group_outer_padding_percentage']))
}

export function init (args) {
  // If you pass in a dom element for args.target, the expectation
  // of a string elsewhere will break.
  const container = select(args.target)
  raiseContainerError(container, args.target)

  let svg = container.selectAll('svg')

  // some things that will need to be calculated if we have a categorical axis.
  if (args.yAxisType === 'categorical') { categoricalInitialization(args, 'y') }
  if (args.xAxisType === 'categorical') { categoricalInitialization(args, 'x') }

  selectXaxFormat(args)

  removeSvgIfChartTypeHasChanged(svg, args)
  svg = addSvgIfItDoesntExist(svg, args)

  addClipPathForPlotArea(svg, args)
  adjustWidthAndHeightIfChanged(svg, args)
  setViewboxForScaling(svg, args)
  removeMissingClassesAndText(svg)
  chartTitle(args)
  removeOutdatedLines(svg, args)

  return this
}
