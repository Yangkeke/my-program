var mongoose = require('mongoose')
var MovieSchema = new mongoose.Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 每次在存储数据前，调用该方法
MovieSchema.pre('save', function(next) {
  // 判断数据是否是新加
  if (this.isNew) {
    // 如果是，则将时间更新
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    // 如果不是就使用当前的时间
    this.meta.updateAt = Date.now()
  }
  // 添加静态方法
  next
})

MovieSchema.statics = {
  // 该方法用来取出当前数据库的所有数据, 并按照更新时间排序
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb) // 然后执行该回调方法
  },

  // 用来查询单条数据
  findById: function(id, cb) {
    return this
      .findOne({_id: id})     
      .exec(cb) // 执行该方法的回调
  }
}

module.exports = MovieSchema