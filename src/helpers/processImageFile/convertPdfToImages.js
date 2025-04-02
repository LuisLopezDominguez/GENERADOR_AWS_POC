import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { resizeImageFile } from './resizeImageFile';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function convertPdfToImages(pdfFile) {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const imageFiles = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/png')
        );

        const imageFile = new File([blob], `${pdfFile.name.replace('.pdf', '')}_p${pageNum}.png`, {
            type: 'image/png',
        });

        const resized = await resizeImageFile(imageFile);
        imageFiles.push(resized);
    }

    return imageFiles;
}
