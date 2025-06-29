module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      price: String,
      imageBase64: String // Changed from image_path to imageBase64
    },
    {
      timestamps: true
    }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("product", schema);
};