{
  function mg_missing_add_text (svg, { missing_text, width, height }) {
    svg.selectAll('.mg-missing-text').data([missing_text])
      .enter().append('text')
      .attr('class', 'mg-missing-text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('dy', '.50em')
      .attr('text-anchor', 'middle')
      .text(missing_text)
  }

  function mg_missing_x_scale (args) {
    args.scales.X = d3.scaleLinear()
      .domain([0, args.data.length])
      .range([getPlotLeft(args), getPlotRight(args)])
    args.scaleFunctions.yf = ({ y }) => args.scales.Y(y)
  }

  function mg_missing_y_scale (args) {
    args.scales.Y = d3.scaleLinear()
      .domain([-2, 2])
      .range([args.height - args.bottom - args.buffer * 2, args.top])
    args.scaleFunctions.xf = ({ x }) => args.scales.X(x)
  }

  function mg_make_fake_data (args) {
    const data = []
    for (let x = 1; x <= 50; x++) {
      data.push({ x, y: Math.random() - (x * 0.03) })
    }
    args.data = data
  }

  function mg_add_missing_background_rect (g, { title, buffer, title_yPosition, width, height }) {
    g.append('svg:rect')
      .classed('mg-missing-background', true)
      .attr('x', buffer)
      .attr('y', buffer + (title ? title_yPosition : 0) * 2)
      .attr('width', width - buffer * 2)
      .attr('height', height - buffer * 2 - (title ? title_yPosition : 0) * 2)
      .attr('rx', 15)
      .attr('ry', 15)
  }

  function mg_missing_add_line (g, { scaleFunctions, interpolate, data }) {
    const line = d3.line()
      .x(scaleFunctions.xf)
      .y(scaleFunctions.yf)
      .curve(interpolate)

    g.append('path')
      .attr('class', 'mg-main-line mg-line1-color')
      .attr('d', line(data))
  }

  function mg_missing_add_area (g, { scaleFunctions, scales, interpolate, data }) {
    const area = d3.area()
      .x(scaleFunctions.xf)
      .y0(scales.Y.range()[0])
      .y1(scaleFunctions.yf)
      .curve(interpolate)

    g.append('path')
      .attr('class', 'mg-main-area mg-area1-color')
      .attr('d', area(data))
  }

  function mg_remove_all_children ({ target }) {
    d3.select(target).selectAll('svg *').remove()
  }

  function mg_missing_remove_legend ({ legendTarget }) {
    if (legendTarget) {
      d3.select(legendTarget).html('')
    }
  }

  function missingData (args) {
    this.init = (args) => {
      this.args = args

      initComputeWidth(args)
      initComputeHeight(args)

      // create svg if one doesn't exist

      const container = d3.select(args.target)
      raiseContainerError(container, args)
      let svg = container.selectAll('svg')
      removeSvgIfChartTypeHasChanged(svg, args)
      svg = addSvgIfItDoesntExist(svg, args)
      adjustWidthAndHeightIfChanged(svg, args)
      setViewboxForScaling(svg, args)
      mg_remove_all_children(args)

      svg.classed('mg-missing', true)
      mg_missing_remove_legend(args)

      chartTitle(args)

      // are we adding a background placeholder
      if (args.show_missing_background) {
        mg_make_fake_data(args)
        mg_missing_x_scale(args)
        mg_missing_y_scale(args)
        const g = addG(svg, 'mg-missing-pane')

        mg_add_missing_background_rect(g, args)
        mg_missing_add_line(g, args)
        mg_missing_add_area(g, args)
      }

      mg_missing_add_text(svg, args)

      this.windowListeners()

      return this
    }

    this.windowListeners = () => {
      windowListeners(this.args)
      return this
    }

    this.init(args)
  }

  const defaults = {
    top: [40, 'number'], // the size of the top margin
    bottom: [30, 'number'], // the size of the bottom margin
    right: [10, 'number'], // size of the right margin
    left: [0, 'number'], // size of the left margin
    buffer: [8, 'number'], // the buffer between the actual chart area and the margins
    legendTarget: ['', 'string'],
    width: [350, 'number'],
    height: [220, 'number'],
    missing_text: ['Data currently missing or unavailable', 'string'],
    show_tooltips: [true, 'boolean'],
    show_missing_background: [true, 'boolean']
  }

  MG.register('missing-data', missingData, defaults)
}
