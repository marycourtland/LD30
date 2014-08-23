class bz.Slider extends GameObject

  constructor: (game, params) ->
    super
    params ||= {}
    @pos = params.pos || xy(100, 100)
    @arm = rth((params.length || 100), (if params.orientation is 'v' then -Math.PI/2 else 0))
    @label = params.label || ""
    @graphics.width = 10
    @graphics.color = 'silver'
    @graphics.handle_width = 30
    @graphics.handle_length = 20
    @graphics.handle_color = 'black'
    @graphics.indicator_pos = add(@pos, params.indicator_pos || (if @arm.th is 0 then xy(-50, 0) else xy(0, 50)))
    @graphics.label_pos = add(@pos, params.label_pos || (if @arm.th is 0 then xy(-50, 0) else xy(0, 50)))

    @scale = # if you want a discrete slider, maybe add a step attribute
      min: params.min || 0
      max: params.max || 1000

    @value = params.value || 0

    @draw_params = {}


    @recalculate = ->
      # recalculate things needed for drawing the slider
      # (doesn't need to be done on every frame)
      fraction = (@value - @scale.min) / (@scale.max - @scale.min)
      handle_pos = add @pos, scale(@arm, fraction)
      @draw_params.endpoint = @endpoint()
      @draw_params.handle1 = add handle_pos, rth(@graphics.handle_length/2, @arm.th)
      @draw_params.handle2 = add handle_pos, rth(-@graphics.handle_length/2, @arm.th)

    @on 'draw', ->
      # slider axis
      draw.line @ctx, @pos, @draw_params.endpoint,
        linewidth: @graphics.width,
        stroke: @graphics.color

      # slider handle
      draw.line @ctx, @draw_params.handle1, @draw_params.handle2,
        linewidth: @graphics.handle_width,
        stroke: @graphics.handle_color

      # value indicator
      draw.text(@ctx, @value.toString(), @graphics.indicator_pos, 'centered')


    @on 'drag', (p) ->
      @value = @getSettingFromPos(p)
      @recalculate()

    @on 'click', (p) ->
      @value = @getSettingFromPos(p)
      @recalculate()

    @endpoint = ->
      add @pos, @arm

    @getSettingFromPos = (p) ->
      proj = @project(p)
      d = if (@arm.th is 0) then (proj.x - @pos.x) else (@pos.y - proj.y)
      s = @scale.min + d/@arm.r * (@scale.max - @scale.min)
      Math.max(Math.min(s, @scale.max), @scale.min)

    @project = (p) ->
      # Project a position onto the axis of this slider
      xy((if @arm.th is 0 then p.x else @pos.x), (if @arm.th is 0 then @pos.y else p.y))

    @contains = (p) ->
      isOnLineSegment p, @pos, @endpoint(), Math.max(@graphics.width/2, @graphics.handle_width/2)


    @recalculate()