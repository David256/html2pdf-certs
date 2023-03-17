import { MutableRefObject, type FunctionComponent } from 'react';
import { CertRow, Html2PdfCertsRef } from './types';
import './Html2PdfCerts.css';
export interface IHtml2PdfCertsProps {
    handler?: MutableRefObject<Html2PdfCertsRef | null>;
    onGenerated?: (data: Blob) => void;
    onStartGenerate?: () => void;
    onEndGenerate?: () => void;
    rows?: CertRow[];
    filename?: string;
    margin?: number;
    enableLinks?: boolean;
    format?: [number, number] | string;
    orientation?: string;
    unit?: string;
    imageUrl?: string;
    transformationScale?: number;
    backgroundColor?: string;
    sizeStyle?: {
        width: string | number;
        height: string | number;
    };
}
export declare const Html2PdfCerts: FunctionComponent<IHtml2PdfCertsProps>;
