#!/usr/bin/env node

/**
 * Gallery Image Compression Script
 * 
 * Scans `public/gallery/uncompress/`, detects image types, compresses them
 * to modern WebP (max 1600px, quality 82%), and outputs to `public/gallery/`.
 * Skips images whose compressed version already exists.
 * Displays a detailed summary of successful, skipped, and failed conversions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const inputDir = path.join(rootDir, 'public', 'gallery', 'uncompress');
const outputDir = path.join(rootDir, 'public', 'gallery');

const SUPPORTED_EXTENSIONS = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.avif',
    '.tiff',
    '.tif',
    '.bmp',
    '.gif',
]);

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 82;

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(i > 1 ? 2 : 1)} ${sizes[i]}`;
}

async function run() {
    console.log('\n======================================================');
    console.log('         ZERO BUGS CLUB - GALLERY COMPRESSION         ');
    console.log('======================================================');
    console.log(`Source Directory : ${inputDir}`);
    console.log(`Target Directory : ${outputDir}`);
    console.log(`Target Format    : WebP (Max ${MAX_DIMENSION}px, Quality ${WEBP_QUALITY}%)`);
    console.log('------------------------------------------------------\n');

    if (!fs.existsSync(inputDir)) {
        console.error(`❌ Input directory does not exist: ${inputDir}`);
        process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const allEntries = fs.readdirSync(inputDir, { withFileTypes: true });
    const imageFiles = allEntries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => {
            if (name.startsWith('.')) return false;
            const ext = path.extname(name).toLowerCase();
            return SUPPORTED_EXTENSIONS.has(ext);
        })
        .sort((a, b) => a.localeCompare(b));

    if (imageFiles.length === 0) {
        console.log('⚠️  No supported images found in uncompress folder.');
        return;
    }

    console.log(`Found ${imageFiles.length} image(s) to process.\n`);

    const results = [];

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const inputFilePath = path.join(inputDir, file);
        const parsed = path.parse(file);
        const outputFileName = `${parsed.name}.webp`;
        const outputFilePath = path.join(outputDir, outputFileName);

        const fileStat = fs.statSync(inputFilePath);
        const originalSize = fileStat.size;

        // Skip logic: if compressed version already exists in outputDir
        if (fs.existsSync(outputFilePath)) {
            const existingStat = fs.statSync(outputFilePath);
            results.push({
                file,
                outputName: outputFileName,
                status: 'SKIPPED',
                reason: 'Already exists in public/gallery',
                originalSize,
                compressedSize: existingStat.size,
            });
            console.log(`[${i + 1}/${imageFiles.length}] ⏭️  SKIP: ${file} (already exists as ${outputFileName})`);
            continue;
        }

        try {
            const image = sharp(inputFilePath).rotate(); // auto-rotate based on EXIF
            const metadata = await image.metadata();

            const shouldResize =
                (metadata.width && metadata.width > MAX_DIMENSION) ||
                (metadata.height && metadata.height > MAX_DIMENSION);

            let pipeline = image;
            if (shouldResize) {
                pipeline = pipeline.resize({
                    width: MAX_DIMENSION,
                    height: MAX_DIMENSION,
                    fit: 'inside',
                    withoutEnlargement: true,
                });
            }

            const buffer = await pipeline
                .webp({
                    quality: WEBP_QUALITY,
                    effort: 4,
                })
                .toBuffer();

            fs.writeFileSync(outputFilePath, buffer);
            const compressedSize = buffer.length;

            const savedPercent = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

            results.push({
                file,
                outputName: outputFileName,
                status: 'SUCCESS',
                originalSize,
                compressedSize,
                savedPercent,
                dimensions: `${metadata.width || '?'}x${metadata.height || '?'}`,
            });

            console.log(
                `[${i + 1}/${imageFiles.length}] ✅ DONE: ${file} -> ${outputFileName} ` +
                    `(${formatBytes(originalSize)} -> ${formatBytes(compressedSize)}, -${savedPercent}%)`
            );
        } catch (err) {
            results.push({
                file,
                outputName: outputFileName,
                status: 'FAILED',
                error: err.message,
                originalSize,
                compressedSize: 0,
            });
            console.error(`[${i + 1}/${imageFiles.length}] ❌ FAIL: ${file} - ${err.message}`);
        }
    }

    // Generate Final Summary Report
    const successful = results.filter((r) => r.status === 'SUCCESS');
    const skipped = results.filter((r) => r.status === 'SKIPPED');
    const failed = results.filter((r) => r.status === 'FAILED');

    console.log('\n======================================================');
    console.log('                 COMPRESSION SUMMARY                  ');
    console.log('======================================================');
    console.log(`Total Images Scanned   : ${imageFiles.length}`);
    console.log(`Successfully Converted : ${successful.length}`);
    console.log(`Skipped (Already Done) : ${skipped.length}`);
    console.log(`Failed                 : ${failed.length}`);
    console.log('------------------------------------------------------');

    if (successful.length > 0) {
        let batchOrigBytes = successful.reduce((sum, r) => sum + r.originalSize, 0);
        let batchCompBytes = successful.reduce((sum, r) => sum + r.compressedSize, 0);
        let batchSavedBytes = batchOrigBytes - batchCompBytes;
        let batchSavedPercent = ((batchSavedBytes / batchOrigBytes) * 100).toFixed(1);

        console.log(`Batch Original Size    : ${formatBytes(batchOrigBytes)}`);
        console.log(`Batch Compressed Size  : ${formatBytes(batchCompBytes)}`);
        console.log(`Batch Space Saved      : ${formatBytes(batchSavedBytes)} (${batchSavedPercent}% reduction)`);
    }

    if (skipped.length > 0) {
        console.log(`\n⏭️  Skipped Files (${skipped.length}):`);
        skipped.forEach((s) => {
            console.log(`   - ${s.file} (exists: ${s.outputName})`);
        });
    }

    if (failed.length > 0) {
        console.log(`\n❌ Failed Files (${failed.length}):`);
        failed.forEach((f) => {
            console.log(`   - ${f.file}: ${f.error}`);
        });
    }

    console.log('======================================================\n');
}

run().catch((err) => {
    console.error('Fatal script error:', err);
    process.exit(1);
});
