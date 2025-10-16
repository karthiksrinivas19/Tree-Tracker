import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";

// Initialize Vision client

const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
});


// Positive keywords - if ANY of these are found, image is VALID
const POSITIVE_KEYWORDS = [
  'tree', 'sapling', 'seedling', 'plant', 'woody', 'houseplant', 
  'bonsai', 'perennial', 'potted', 'stem', 'leaf', 'foliage',
  'flora', 'botanical', 'shrub', 'bush', 'herb'
];

// Strong negative keywords - if ONLY these are present (no positive), reject
const STRONG_NEGATIVE_KEYWORDS = [
  'toy', 'drawing', 'painting', 'illustration', 'cartoon', 
  'screenshot', 'poster', 'logo', 'clipart'
];

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl)
      return NextResponse.json({ success: false, message: "No image URL provided" }, { status: 400 });

    // Call Cloud Vision API
    const [result] = await client.labelDetection(imageUrl);
    const detectedLabels = result.labelAnnotations.map(label => label.description.toLowerCase());
    console.log("Detected labels:", detectedLabels);

    // Check for positive matches
    const positiveMatches = [];
    const hasPositive = detectedLabels.some(label => {
      const match = POSITIVE_KEYWORDS.some(pos => label.includes(pos));
      if (match) positiveMatches.push(label);
      return match;
    });

    // Check for strong negatives
    const hasStrongNegative = detectedLabels.some(label => 
      STRONG_NEGATIVE_KEYWORDS.some(neg => label.includes(neg))
    );

    console.log("Positive matches found:", positiveMatches);
    console.log("hasPositive:", hasPositive);
    console.log("Has strong negative:", hasStrongNegative);
    console.log("Condition check (hasPositive && !hasStrongNegative):", hasPositive && !hasStrongNegative);

    // Decision logic:
    // If positive keywords found AND no strong negatives → VALID
    if (hasPositive && !hasStrongNegative) {
      return NextResponse.json({
        success: true,
        message: "Tree/plant detected",
        labels: detectedLabels,
        matchedKeywords: positiveMatches
      });
    } 
    // If strong negative found → INVALID
    else if (hasStrongNegative) {
      return NextResponse.json({
        success: false,
        message: "Image appears to be artificial (drawing/toy/illustration)",
        labels: detectedLabels
      });
    }
    // No positive matches → INVALID
    else {
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