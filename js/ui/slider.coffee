class bz.Slider extends GameObject

  constructor: (game, params) ->
    super
    params ||= {}
    @pos = params.pos || xy(100, 100)
    @arm = rth((params.length || 100), (if params.orientation is 'v' then -Math.PI/2 else 0))
    @graphics.width = 10
    @graphics.color = 'silver'
    @graphics.handle_width = 50
    @graphics.handle_length = 20
    @graphics.handle_color = 'black'

    @scale = # if you want a discrete slider, maybe add a step attribute
      min: params.min || 0
      max: params.max || 1000

    @value = params.value || 0
    @handle_pos = xy(0,0) # this will be set each tick

    @on 'tick', ->
      # interpolate handle position
      fraction = (@value - @scale.min) / (@scale.max - @scale.min)
      @handle_pos = add @pos, scale(@arm, fraction)


    @on 'draw', ->
      draw.line @ctx, @pos, @endpoint(),
        linewidth: @graphics.width,
        stroke: @graphics.color

      # slider handle
      handle1 = add @handle_pos, rth(@graphics.handle_length/2, @arm.th)
      handle2 = add @handle_pos, rth(-@graphics.handle_length/2, @arm.th)
      draw.line @ctx, handle1, handle2,
        linewidth: @graphics.handle_width,
        stroke: @graphics.handle_color

    @on 'drag', (p) ->
      @value = @getSettingFromPos(p) unless !@contains(@project(p))

    @on 'click', (p) ->
      @value = @getSettingFromPos(p)

    @endpoint = ->
      add @pos, @arm

    @getSettingFromPos = (p) ->
      fraction = distance(@pos, @project(p)) / @arm.r
      @scale.min + fraction * (@scale.max - @scale.min)

    @project = (p) ->
      # Project a position onto the axis of this slider
      xy((if @arm.th is 0 then p.x else @pos.x), (if @arm.th is 0 then @pos.y else p.y))

    @contains = (p) ->
      isOnLineSegment p, @pos, @endpoint(), Math.max(@graphics.width/2, @graphics.handle_width/2)