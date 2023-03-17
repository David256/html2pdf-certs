export interface CertRow {
    type?: 'text' | 'h1' | 'h2' | 'h3' | 'h4' | 'break';
    content?: string | CertRow[];
    times?: number;
}
export interface Html2PdfCertsRef {
    generatePdf: () => void;
}
