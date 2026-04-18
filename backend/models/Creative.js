const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema({
    slideNumber: Number,
    type: String,
    heading: String,
    subheading: String,
    bodyText: String,
    callout: String,
    visualPrompt: String,
    visualType: String,
    emoji: String,
    layout: String,
    backgroundColor: String,
    imageData: String, // base64 SVG or image
    brandName: String,
}, { _id: false });

const CreativeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    format: { type: String, required: true },
    originalPrompt: String,
    tone: String,
    theme: {
        primaryColor: String,
        secondaryColor: String,
        accentColor: String,
        backgroundColor: String,
        textColor: String,
        fontStyle: String,
        backgroundStyle: String,
    },
    slides: [SlideSchema],
    caption: String,
    hashtags: [String],
    altText: String,
    insights: {
        hook: String,
        narrative: String,
        cta: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("Creative", CreativeSchema);
