bz.initGui = ->

  bz.mag_sider = new bz.Slider game,
    pos: xy(100, 300)
    length: 200
    orientation: 'v'
    label: "MAGNETIC FIELD"
    min: 0
    max: 1000
    value: 234

  bz.vac_slider = new bz.Slider game, 
    pos: xy(300, 300)
    length: 200
    orientation: 'v'
    label: "VACUUM SPEED"
    min: 0
    max: 1000
    value: 876

  bz.temp_output = new bz.OutputDial game,
    pos: xy(500, 300)
    max_angle: 90
    zero_angle: 180
    dir: 'cw'
    radius: 100
    label: "TEMP"
    min: 0
    max: 50
    value: 20






