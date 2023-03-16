import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type FunctionComponent } from 'react'
import { useState, createElement } from 'react'
// @ts-expect-error
import html2pdf from 'html2pdf.js'

import { CertRow } from './types'

import './Html2PdfCerts.css'
// @ts-expect-error
import imageDefault from '../../assets/default.png'


export interface Html2PdfCertsRef {
  generatePdf: () => void,
}


export interface IHtml2PdfCertsProps {
  onGenerated?: () => void,
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
}


export const Html2PdfCerts = forwardRef<Html2PdfCertsRef, IHtml2PdfCertsProps>((props, ref) => {
  const {
    onGenerated = () => {},
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
  } = props

  const [pendingShot, setPendingShot] = useState(false)

  const divRef = useRef<HTMLDivElement>(null)

  const generatePdf = async () => {
    setPendingShot(true)
  }

  const buildPdf = async () => {
    console.log('calls generatePdf method')
    const worker = new html2pdf.Worker()

    const opt = {
      margin,
      filename,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2 },
      enableLinks,
      jsPDF:        { unit, format, orientation },
      // jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    }
    // [1600, 899]
  
    worker.set(opt).from(divRef.current).save().then(() => {
      setPendingShot(false)
      onGenerated()
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

  useImperativeHandle(ref, () => {
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
        ...(pendingShot ? {} : stylesForScale)
      }}
      ref={divRef}
      className="html-2-pdf-certs"
    >
      {rows.map((row) => parseRow(row))}
    </div>
  )
})
