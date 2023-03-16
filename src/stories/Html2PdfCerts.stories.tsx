import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useRef } from 'react'

import { Html2PdfCerts, Html2PdfCertsRef } from '../components/html2pdf-certs/Html2PdfCerts'

// @ts-expect-error
import imageDefaultDark from './assets/default.dark.png'

export default {
  title: 'UI/Html2PdfCerts',
  component: Html2PdfCerts,
  argTypes: {},
} as ComponentMeta<typeof Html2PdfCerts>

const Template: ComponentStory<typeof Html2PdfCerts> = (args) => {
  const ref = useRef<Html2PdfCertsRef>(null)

  const onClick = () => {
    if (!ref.current) {
      alert('ref current is null')
      return
    }
    ref.current.generatePdf();
  }

  return(
    <>
    <button onClick={onClick}>Generate PDF</button>
    <Html2PdfCerts ref={ref} {...args} />
    </>
  )
}

export const BasicExample = Template.bind({})
BasicExample.args = {
  imageUrl: imageDefaultDark,
  transformationScale: 0.3,
  backgroundColor: 'red',
  rows: [
    { type: 'break', times: 17 },
    { type: 'h3', content: 'Certifica que' },
    { type: 'h1', content: 'Persona Personalidad' },
    { type: 'h3', content: 'CC 10002309990' },
    { type: 'break' },
    { type: 'break' },
    { type: 'h4', content: 'Partició en el simposio' },
    { type: 'break' },
    { type: 'h2', content: 'Cómo hacer las cosas desde otro lugar' },
    { type: 'break' },
    {
      type: 'h4',
      content: [
        { type: 'text', content: 'En constancia se expide el presente certificado de' },
        { type: 'break' },
        { type: 'text', content: 'educación médica discontinua de modalidad virtual' },
        { type: 'break' },
        { type: 'break' },
        { type: 'text', content: '(41 crédito - Educación discontinua)' },
      ]
    },
  ]
} 
