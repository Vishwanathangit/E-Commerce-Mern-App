module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: String,
            email: String,
            address: String,
            phone_number: String,
            uid: String
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

    return mongoose.model("user", schema);
}