import { MutableRefObject, useEffect, useImperativeHandle, useMemo, useRef, type FunctionComponent } from 'react'
import { useState, createElement } from 'react'
// @ts-expect-error
import html2pdf from 'html2pdf.js'

import { CertRow, Html2PdfCertsRef } from './types'

import './Html2PdfCerts.css'
// @ts-expect-error
import imageDefault from '../../assets/default.png'


export interface IHtml2PdfCertsProps {
  handler?: MutableRefObject<Html2PdfCertsRef | null>
  onGenerated?: (data: Blob) => void,
  onStartGenerate?: () => void,
  onEndGenerate?: () => void,
  rows?: CertRow[],
  filename?: string,
  margin?: number,
  enableLinks?: boolean,
  format?: [number, number] | string,
  orientation?: string,
  unit?: string,
  imageUrl?: string,
  transformationScale?: number,
  backgroundColor?: string,
  sizeStyle?: {
    width: string | number,
    height: string | number,
  },
}


export const Html2PdfCerts: FunctionComponent<IHtml2PdfCertsProps> = (props) => {
  const {
    handler,
    onGenerated = () => {},
    onStartGenerate = () => {},
    onEndGenerate = () => {},
    rows = [],
    filename = 'myfile.pdf',
    margin = 0,
    enableLinks = true,
    format = [1600, 899],
    orientation = 'landscape',
    unit = 'px',
    imageUrl,
    transformationScale = 0.5,
    backgroundColor = 'yellowgreen',
    sizeStyle,
  } = props

  const [pendingShot, setPendingShot] = useState(false)

  const divRef = useRef<HTMLDivElement>(null)

  const generatePdf = async () => {
    onStartGenerate()
    setPendingShot(true)
  }

  const buildPdf = async () => {
    console.log('calls generatePdf method')
    const worker = new html2pdf.Worker()

    const opt = {
      margin,
      filename,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true },
      enableLinks,
      jsPDF:        { unit, format, orientation },
      // jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    }
    // [1600, 899]
  
    const worked = worker
      .set(opt)
      .from(divRef.current)
      .toPdf()
      .output('blob').then((data: Blob) => {
        console.log('blob data', data)
        onGenerated(data)
        return data
      })
      .save().then(() => {
        setPendingShot(false)
        onEndGenerate()
      })
  }

  const parseContent = (content?: CertRow['content']) => {
    if (Array.isArray(content)) {
      return content.map((row) => parseRow(row))
    }    
    return (content || '').toString()
  }

  const parseRow = (row: CertRow): any => {
    switch (row.type) {
      case 'text':
        return parseContent(row.content)
      case 'break':
        if (typeof row.times !== 'number')
          return <br />
        return Array.from({length: row.times}, (_, index) => <br key={index} />)
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
        return createElement(row.type, {}, parseContent(row.content))
      default:
        return <p>Unknown element type {row.type}</p>
    }
  }

  useImperativeHandle(handler, () => {
    return {
      generatePdf,
    }
  })

  const stylesForScale = useMemo(() => ({
    transform: `scale(${transformationScale || 0.5})`,
    transformOrigin: 'top left',
  }), [transformationScale])

  useEffect(() => {
    if (pendingShot) {
      buildPdf()
    }
  }, [pendingShot])

  return (
    <div
      style={{
        backgroundColor,
        backgroundImage: `url(${imageUrl || imageDefault})`,
        ...(sizeStyle ? {
          width: typeof sizeStyle.width === 'number' ? `${sizeStyle.width}px` : sizeStyle.width,
          height: typeof sizeStyle.height === 'number' ? `${sizeStyle.height}px` : sizeStyle.height,
        } : undefined),
        ...(pendingShot ? {} : stylesForScale)
      }}
      ref={divRef}
      className="html-2-pdf-certs"
    >
      {rows.map((row) => parseRow(row))}
    </div>
  )
}