import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Html2PdfCerts } from '../components/html2pdf-certs/Html2PdfCerts'

export default {
  title: 'UI/Html2PdfCerts',
  component: Html2PdfCerts,
  argTypes: {},
} as ComponentMeta<typeof Html2PdfCerts>

const Template: ComponentStory<typeof Html2PdfCerts> = (args) => <Html2PdfCerts {...args} />

export const BasicExample = Template.bind({})
