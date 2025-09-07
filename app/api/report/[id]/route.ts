import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeIdeality } from '@/lib/computeIdeality';
import { generateScoreBreakdownChart } from '@/lib/chart-generator';
import puppeteer from 'puppeteer';
import { renderToString } from 'react-dom/server';
import PropertyReportTemplate from '@/components/PropertyReportTemplate';
import React from 'react';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;

    // Fetch property data
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Calculate ideality score and breakdown
    const idealityResult = computeIdeality(property);
    
    // Get neighborhood data (properties within 5km radius - simplified)
    const neighborhoodProperties = await prisma.property.findMany({
      where: {
        AND: [
          { id: { not: propertyId } },
          {
            lat: {
              gte: property.lat - 0.05, // Approximate 5km radius
              lte: property.lat + 0.05,
            },
          },
          {
            lng: {
              gte: property.lng - 0.05,
              lte: property.lng + 0.05,
            },
          },
        ],
      },
    });

    // Calculate neighborhood statistics
    const neighborhoodData = {
      averagePrice: neighborhoodProperties.length > 0 
        ? Math.round(neighborhoodProperties.reduce((sum, p) => sum + p.price, 0) / neighborhoodProperties.length)
        : property.price,
      averageSqft: neighborhoodProperties.length > 0
        ? Math.round(neighborhoodProperties.reduce((sum, p) => sum + p.sqft, 0) / neighborhoodProperties.length)
        : property.sqft,
      totalProperties: neighborhoodProperties.length + 1,
      propertyTypes: neighborhoodProperties.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
    };

    // Generate chart image
    const chartImage = generateScoreBreakdownChart(idealityResult.breakdown);

    // Prepare report data
    const reportData = {
      id: property.id,
      title: property.title,
      price: property.price,
      sqft: property.sqft,
      yearBuilt: property.yearBuilt,
      beds: property.beds,
      baths: property.baths,
      lat: property.lat,
      lng: property.lng,
      type: property.type,
      locationScore: property.locationScore,
      safetyScore: property.safetyScore,
      schoolScore: property.schoolScore,
      commuteMinutes: property.commuteMinutes,
      idealityScore: idealityResult.score,
      createdAt: property.createdAt.toISOString(),
      scoreBreakdown: idealityResult.breakdown,
      neighborhoodData,
    };

    // Render React component to HTML string
    const htmlContent = renderToString(
      React.createElement(PropertyReportTemplate, {
        property: reportData,
        chartImage,
      })
    );

    // Create complete HTML document
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Property Report - ${property.title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              color: #1f2937;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="property-report-${propertyId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating PDF report:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    );
  }
}
