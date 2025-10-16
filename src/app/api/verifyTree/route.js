import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";

const POSITIVE_KEYWORDS = [
  'tree','sapling','seedling','plant','woody','houseplant',
  'bonsai','perennial','potted','stem','leaf','foliage',
  'flora','botanical','shrub','bush','herb'
];

const STRONG_NEGATIVE_KEYWORDS = [
  'toy','drawing','painting','illustration','cartoon',
  'screenshot','poster','logo','clipart'
];

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl)
      return NextResponse.json({ success: false, message: "No image URL provided" }, { status: 400 });

    // Lazy initialization of Vision client
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      return NextResponse.json({ success: false, message: "Vision credentials not set" }, { status: 500 });
    }

    const client = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    });

    // Call Cloud Vision API
    const [result] = await client.labelDetection(imageUrl);
    const detectedLabels = result.labelAnnotations.map(label => label.description.toLowerCase());

    const positiveMatches = [];
    const hasPositive = detectedLabels.some(label => {
      const match = POSITIVE_KEYWORDS.some(pos => label.includes(pos));
      if (match) positiveMatches.push(label);
      return match;
    });

    const hasStrongNegative = detectedLabels.some(label =>
      STRONG_NEGATIVE_KEYWORDS.some(neg => label.includes(neg))
    );

    if (hasPositive && !hasStrongNegative) {
      return NextResponse.json({
        success: true,
        message: "Tree/plant detected",
        labels: detectedLabels,
        matchedKeywords: positiveMatches
      });
    } else if (hasStrongNegative) {
      return NextResponse.json({
        success: false,
        message: "Image appears to be artificial (drawing/toy/illustration)",
        labels: detectedLabels
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No tree or plant detected",
        labels: detectedLabels
      });
    }

  } catch (err) {
    console.error("Vision API error:", err);
    return NextResponse.json({
      success: false,
      message: "Vision API error",
      error: err.message
    }, { status: 500 });
  }
}
