class bz.OutputDial extends GameObject

  constructor: (game, params) ->
    super
    params ||= {}
    @pos = params.pos || xy(100, 100)
    @zero_angle = radians(params.zero_angle || 180)
    @max_angle = radians(params.max_angle || 90)
    @dir = if params.dir is 'ccw' then -1 else 1
    @arm1 = rth((params.radius || 100), @zero_angle)
    @arm2 = rth((params.radius || 100), @zero_angle + @dir * @max_angle)
    @label = params.label || ""
    @graphics.width = 10
    @graphics.color = 'silver'
    @graphics.pointer_width = 10
    @graphics.pointer_color = 'black'

    @graphics.indicator_pos = add(@pos, params.indicator_pos || xy(-@arm1.r/2, 25))
    @graphics.label_pos = add(@pos, params.label_pos || xy(-@arm1.r/2, 50))

    @scale =
      min: params.min || 0
      max: params.max || 1000

    @value = params.value || 0

    @draw_params = {}


    @recalculate = ->
      # recalculate things needed for drawing the dial
      # (doesn't need to be done on every frame)
      fraction = (@value - @scale.min) / (@scale.max - @scale.min)
      @draw_params.endpoint = @endpoint()
      @draw_params.pointer = add @pos, rotate(@arm1, @max_angle * fraction)
      @draw_params.center_offset = xy(-@graphics.width/4, -@graphics.width/4)
      @draw_params.pos0 = add @pos, @draw_params.center_offset
      @draw_params.pos1 = add @draw_params.pos0, @arm1
      @draw_params.pos2 = add @draw_params.pos0, @arm2

    @on 'draw', ->
      # dial arc
      draw.arc @ctx, @pos, 0.9 * @arm1.r, @zero_angle, (@zero_angle + @max_angle),
        linewidth: @graphics.width
        stroke: @graphics.color
        fill: 'transparent'
      draw.line @ctx, @draw_params.pos0, @draw_params.pos1,
        linewidth: @graphics.width/2
        stroke: @graphics.color
      draw.line @ctx, @draw_params.pos0, @draw_params.pos2,
        linewidth: @graphics.width/2
        stroke: @graphics.color

      # pointer
      draw.line @ctx, @draw_params.pos0, @draw_params.pointer,
        linewidth: @graphics.pointer_width
        stroke: @graphics.pointer_color
        linecap: 'round'

      # value indicator and label
      draw.text(@ctx, @value.toString(), @graphics.indicator_pos, 'centered')
      draw.text(@ctx, @label, @graphics.label_pos, 'centered')

    @set = (@value) ->
      @recalculate()

    @endpoint = ->
      add @pos, @arm2

    @recalculate()