
debug      = require('debug')('multer:gc')
fs         = require('fs')
onFinished = require('on-finished')

module.exports = (req, res, next) ->
  cleanFn = ->
    list = []

    if req.file
      list.push req.file
    if req.files instanceof Array
      for file in req.files
        list.push file
    else if typeof req.files is 'object'
      for name,arr of req.files
        for file in arr
          list.push file

    for file in list
      if file.skip or file.removed
        debug "#{file.fieldname} #{file.path} skipped"
      else
        file.removed = true

        do (file) -> fs.unlink file.path, (err) ->
          if err
            debug "#{file.fieldname} #{file.path} remove error: #{err.message}"
          else
            debug "#{file.fieldname} #{file.path} removed"

    return null

  res.on 'error', cleanFn
  onFinished res, cleanFn

  next()
