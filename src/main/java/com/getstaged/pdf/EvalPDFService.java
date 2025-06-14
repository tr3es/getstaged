package com.getstaged.pdf;

import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;

import java.io.IOException;

public class EvalPDFService {

    public void genererDocumentFromHTML(String pathPDF, String html)
            throws IOException {
        PdfWriter writer = new PdfWriter(pathPDF);
        Document doc = HtmlConverter.convertToDocument(html, writer);
        doc.close();
    }

}
